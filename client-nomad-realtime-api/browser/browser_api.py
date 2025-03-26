from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
from base import Base
import time
import pyaudio
import wave

class BrowserApi(Base):
    def __init__(self):
        Base.__init__(self)

        # ブラウザ用WebSocketエンドポイントを追加
        self.browser_clients = set()
        
        @self.app.websocket("/browser")
        async def websocket_endpoint(websocket: WebSocket):
            await websocket.accept()
            self.browser_clients.add(websocket)
            try:
                while True:
                    # クライアントからのメッセージを待つ（必要に応じて）
                    await websocket.receive_text()
            except Exception:
                pass
            finally:
                self.browser_clients.remove(websocket)


    async def broadcast(self, message):
        print('sending')
        """全ブラウザにメッセージをブロードキャスト"""
        for client in self.browser_clients:
            try:
                print('send data:', message)
                await client.send_json({"state": message})
            except Exception:
                # クライアントとの接続に問題がある場合
                self.browser_clients.remove(client)


    async def appear(self, websocket=None):
        asyncio.create_task(self.broadcast('appear'))
        # await asyncio.sleep(2)
        play_wav('r-appear.wav')
        return await super().appear(websocket)


    async def disappear(self, websocket=None):
        asyncio.create_task(self.broadcast('disappear'))
        # await asyncio.sleep(2)
        play_wav('r-disappear.wav')
        return await super().disappear(websocket)


    def hello(self, websocket=None):
        asyncio.create_task(self.broadcast('hello'))
        return super().hello(websocket)
        

    async def dance(self, websocket=None):
        await self.broadcast('dancestart')
        await asyncio.sleep(22)
        await self.broadcast('dancestop')
        await super().dance(websocket)


def play_wav(file_path):
    # waveファイルを読み込む
    wf = wave.open(file_path, 'rb')

    p = pyaudio.PyAudio()

    # オーディオストリームを開く
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
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
    browser_api = BrowserApi()
    uvicorn.run(browser_api.app, host="0.0.0.0", port=8765)