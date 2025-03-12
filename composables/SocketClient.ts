export const useWebSocket = () => {
    let ws: WebSocket | null = null;
    let isConnected = ref(false);

    function connect(handler: (event: MessageEvent) => void) {
        ws = new WebSocket("ws://localhost:8765");

        ws.onopen = () => {
            console.log("WebSocket connected!");
            isConnected.value = true;
        };

        ws.onmessage = (event) => {
            console.log("Received from server:", event.data);
            handler(event);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket closed.");
            isConnected.value = false;
        };
    }

    function disconnect() {
        if (ws) {
            ws.close();
            ws = null;
            isConnected.value = false;
        }
    }

    function sendMessage(message: string) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log("Sent to server:", message);
        } else {
            console.error("WebSocket not connected.");
        }
    }


    return { connect, disconnect, sendMessage,  isConnected };
}
