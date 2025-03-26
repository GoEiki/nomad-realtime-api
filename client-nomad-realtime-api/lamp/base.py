import uvicorn
import json
from fastapi import FastAPI, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from fastapi.responses import FileResponse

import time

# リクエストボディのデータモデル
class CommandRequest(BaseModel):
    command: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


class Base:
    def __init__(self):
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
                        
                        # else:
                        #     await self.connection_manager.send_message(json.dumps({"error": "Invalid command"}), websocket)
                        else:
                            await self.connection_manager.send_message(json.dumps({"error": "Command not specified"}), websocket)
                            
                    except json.JSONDecodeError:
                        # JSONでない場合は生のテキストとして処理
                        await self.handle_raw_message(websocket, data)
                    
            except WebSocketDisconnect:
                self.connection_manager.disconnect(websocket)
    
    # WebSocket用のメソッド（非同期）
    async def appear(self, websocket: WebSocket = None):
        # 継承先で実装
        if websocket:
            await self.connection_manager.send_message('confirm', websocket)
    
    async def disappear(self, websocket: WebSocket):
        # 継承先で実装
        if websocket:
            await self.connection_manager.send_message('confirm', websocket)
    
    async def hello(self, websocket: WebSocket):
        # 継承先で実装
        if websocket:
            await self.connection_manager.send_message('{"response": "hello command received"}', websocket)
            
    async def dance(self, websocket: WebSocket):
        # 継承先で実装
        if websocket:
            await self.connection_manager.send_message('confirm', websocket)
    
    async def handle_raw_message(self, websocket: WebSocket, message: str):
        # 生のテキストメッセージを処理する場合はこのメソッドをオーバーライド
        await self.connection_manager.send_message('{"response": "Message received"}', websocket)
    
    # ブロードキャストユーティリティメソッド
    async def broadcast_message(self, message: str):
        await self.connection_manager.broadcast(message)

# アプリケーションを実行
if __name__ == "__main__":
    base = Base()
    uvicorn.run(base.app, host="localhost", port=8765)
