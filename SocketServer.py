import asyncio
import websockets

# クライアントからのデータを処理する
async def handle_connection(websocket, path):
    async for message in websocket:
        print(f"Received from client: {message}")
        await websocket.send("Message received!")  # 確認用の応答

# WebSocketサーバーを立ち上げる
start_server = websockets.serve(handle_connection, "0.0.0.0", 8765)  # 全てのIPからの接続を許可

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
