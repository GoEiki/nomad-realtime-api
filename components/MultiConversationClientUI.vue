<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
import { ConnectUser } from '@/composables/APIClient';
const clientCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const serverCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const { connectMultiConversation, disconnectConversation, CancelResponse, setClient, ConversationHandler, setCanvas } = ConnectUser();
const { connect, disconnect, sendMessage, isConnected } = useWebSocket();
const usernameInput = ref('');
const username = ref<string | null>(null);
onMounted(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        username.value = savedUsername;
    }
    if (username.value) {
        setClient(username.value);
    }
    else {
        setClient();
    }
    ConversationHandler();
    if (clientCanvasRef.value && serverCanvasRef.value) {
        setCanvas(clientCanvasRef.value, serverCanvasRef.value);
    }
    watch(realtimestore.NomadEvents, () => {
        if (realtimestore.NomadEvents.length > 0) {
            const latestEvent = realtimestore.NomadEvents[realtimestore.NomadEvents.length - 1];
            if (latestEvent.event.event === 'client.event') {
                console.log('client event:', latestEvent.event);
                sendMessage(JSON.stringify(latestEvent.event));
            }
        }
    });
});
onUnmounted(() => {
    if (realtimestore.isConnected) {
        disconnectConversation();
    }
    if (isConnected.value) {
        disconnect();
    }
});
const saveUsername = () => {
    if (usernameInput.value.trim()) {
        username.value = usernameInput.value.trim();
        localStorage.setItem('username', username.value);
        window.location.reload()
    }
};
async function toggleWebSocketConnection() {
    if (isConnected.value) {
        disconnect();
    } else {
        connect((message) => {
            console.log('Relayed message:', message);
            const data = (() => {
                try {
                    return JSON.parse(message.data);
                } catch {
                    return { event: "notify.event", data: { message: message.data } };
                }
            })(); 
            realtimestore.client?.sendNomadEvent(data);
        });
    }
}
async function toggleConnection() {
    if (realtimestore.isConnected) {
        disconnectConversation();
    } else {
        connectMultiConversation();
    }
}
async function sendTestMessage() {
    if (isConnected.value) {
        sendMessage(JSON.stringify({ event: 'test.event', data: 'This is a test message' }));
    } else {
        console.log('WebSocket is not connected');
    }
}
</script>
<template>
    <div v-if="!username">
        <input v-model="usernameInput" id="username" type="text" placeholder="デバイス名を入力" />
        <button @click="saveUsername">適用</button>
    </div>
    <div v-else>
        <input v-model="usernameInput" id="username" type="text" :placeholder="'Currently　' + username" /> <!-- 修正 -->
        <button @click="saveUsername">適用</button>
    </div>
    <button @click="toggleConnection"
        :style="{ backgroundColor: !realtimestore.isConnected ? '#4CAF50' : '#cc4d4d', color: '#fff' }"
        class="styled-button">
        RELAY：
        {{ realtimestore.isConnected ? '切断' : '接続' }}
    </button>
    <button @click="toggleWebSocketConnection"
        :style="{ backgroundColor: !isConnected ? '#4CAF50' : '#cc4d4d', color: '#fff' }" class="styled-button">
        LOCAL：
        {{ isConnected ? '切断' : '接続' }}
    </button>
    <button @click="sendTestMessage" :style="{ backgroundColor: '#2196F3', color: '#fff' }" class="styled-button">
        SEND TEST
    </button>

    <div class="audio-waveform">
        <h3>USER</h3>
        <canvas ref="clientCanvasRef" width="200" height="100" class="styled-canvas"></canvas>
    </div>
    <div class="audio-waveform">
        <h3>AGENT</h3>
        <canvas ref="serverCanvasRef" width="200" height="100" class="styled-canvas"></canvas>
    </div>
    <button @click="CancelResponse()" >
        Cancel Response
    </button>
</template>

<style scoped></style>
