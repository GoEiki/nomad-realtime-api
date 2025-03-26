from base import Base, ConnectionManager
import uvicorn
import json
from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from fastapi.responses import FileResponse
from switchbot_ble import Bulb
import uvicorn
import time
import wave
import pyaudio

# リクエストボディのデータモデル
class CommandRequest(BaseModel):
    command: str
    content: str

class BulbApi(Base, Bulb):
    def __init__(self, address):
        self.app = FastAPI()
        self.connection_manager = ConnectionManager()

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # すべてのオリジンを許可
            allow_credentials=True,
            allow_methods=["*"],  # すべての HTTP メソッドを許可
            allow_headers=["*"],  # すべての HTTP ヘッダーを許可
        )

        # HTTP POSTルートの登録
        @self.app.post("/post")
        async def handle_command(request: CommandRequest):
            # commandの内容によって関数を実行
            if request.command == "appear":
                await self.appear()

            elif request.command == "disappear":
                await self.disappear()

            elif request.command == "hello":
                await self.hello()
            
            elif request.command == "dance":
                await self.dance()
            
            elif request.command == "speak":
                await self.speak(request.content)

            else:
                raise HTTPException(status_code=400, detail="Invalid command")
            
            return {"message": "hello world"}
        
        # WebSocketルートの登録
        @self.app.websocket("/")
        async def websocket_endpoint(websocket: WebSocket):
            await self.connection_manager.connect(websocket)
            try:
                while True:
                    # クライアントからメッセージを受信
                    data = await websocket.receive_text()

                    # メッセージをJSON形式とみなして処理
                    try:
                        message = json.loads(data)
                        print('recieved:',message)
                        
                        # commandキーがある場合、HTTPエンドポイントと同様に処理
                       
                        if message["data"]["command"] == "appear":
                            await self.appear(websocket)
                        
                        elif message["data"]["command"] == "disappear":
                            await self.disappear(websocket)
                        
                        elif message["data"]["command"] == "hello":
                            await self.hello(websocket)

                        elif message["data"]["command"] == "dance":
                            await self.dance(websocket)
                        
                        elif message["data"]["command"] == "speak":
                            await self.speak(message["data"]["content"])
                        
                        # else:
                        #     await self.connection_manager.send_message(json.dumps({"error": "Invalid command"}), websocket)
                        else:
                            await self.connection_manager.send_message(json.dumps({"error": "Command not specified"}), websocket)
                            
                    except json.JSONDecodeError:
                        # JSONでない場合は生のテキストとして処理
                        await self.handle_raw_message(websocket, data)
                    
            except WebSocketDisconnect:
                self.connection_manager.disconnect(websocket)
        Bulb.__init__(self, address)

    # 今回はランプを対話デバイスとして使用しない（ダンスのときのみ）        
    # def appear(self, websocket=None):
    #     self.turn_on()
    #     return super().appear(websocket)

    # def disappear(self, websocket=None):
    #     self.turn_off()
    #     return super().disappear(websocket)
    
    # def hello(self, websocket=None):
    #     self.change_color(255, 255, 0, 50)
    #     time.sleep(1)
    #     self.change_color(255, 255, 255, 50)
    #     return super().hello(websocket)
    
    # def dance(self, websocket=None):
    #     self.change_color(0, 0, 255, 5)
    #     self.turn_off()
    #     self.change_brightness(10)
    #     self.change_color(0, 255, 0, 20)
    #     self.change_color(255, 0, 0, 20)
    #     self.turn_off()

    #     return super().dance(websocket)

    # 音声再生
    def speak(text:str):
        if text == "appear":
            play_wav('r-appear.wav')
        elif text == "disappear":
            play_wav('r-disappear.wav')
            

def play_wav(file_path, output_index):
    # waveファイルを読み込む
    wf = wave.open(file_path, 'rb')

    p = pyaudio.PyAudio()

    # オーディオストリームを開く
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output_device_index=output_index,
                    output=True)

    # データを読み込み、再生
    chunk_size = 1024
    data = wf.readframes(chunk_size)
    while data:
        stream.write(data)
        data = wf.readframes(chunk_size)

    # 最後のバッファをフラッシュするための待機
    time.sleep(0.35)
    # ストリームを停止・終了
    stream.stop_stream()
    stream.close()

    # PyAudioを終了
    p.terminate()

    # ファイルを閉じる
    wf.close()


if __name__=='__main__':
    bulb_api = BulbApi(address='')
    uvicorn.run(bulb_api.app, host="0.0.0.0", port=8765)