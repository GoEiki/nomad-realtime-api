import asyncio
import websockets

async def handle_connection(websocket):
    async for message in websocket:
        print(f"Received from client: {message}")
        await websocket.send("Message received!")  # 確認用の応答

async def start_server():
    server = await websockets.serve(handle_connection, "0.0.0.0", 8765)  # 全てのIPからの接続を許可
    print("WebSocket server started on ws://0.0.0.0:8765")
    await server.wait_closed()  # サーバーを永続的に動作させる

if __name__ == "__main__":
    asyncio.run(start_server())