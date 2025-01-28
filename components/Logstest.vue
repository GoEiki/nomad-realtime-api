<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
import { ConnectConsole } from '@/composables/APIConsoleClient';
const clientCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const serverCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const { connectConversation, disconnectConversation, setClient, ConversationHandler, setCanvas, NomadEventsHandler } = ConnectConsole();
onMounted(() => {
    setClient();
    ConversationHandler();
    NomadEventsHandler();
    if (clientCanvasRef.value && serverCanvasRef.value) {
        setCanvas(clientCanvasRef.value, serverCanvasRef.value);   
    }
});
onUnmounted(() => {
    if (realtimestore.isConnected) {
        disconnectConversation();
    }
});
async function toggleConnection() {
  if (realtimestore.isConnected) {
    disconnectConversation();
  } else {
    connectConversation();
  }
}
function testtransfer(id:string) {
    const client = realtimestore.client;
  if(client){
    client.sendNomadEvent({ event: 'transfer.event',data:{newClient:id} });
  }
}
</script>
<template>
      <button @click="toggleConnection":style="{backgroundColor: !realtimestore.isConnected ? '#4CAF50' : '#cc4d4d', color: '#fff'}">
        {{ realtimestore.isConnected ? '切断' : '接続' }}
      </button>
      <button @click="realtimestore.clearState">
        クリア
      </button>
      <button @click="realtimestore.toggleMute" :style="{backgroundColor: realtimestore.isMuted ? '#4CAF50' : '#808080', color: '#fff'}">
        {{ realtimestore.isMuted ? 'MUTE' : 'UNMUTE' }}
      </button>
      <div class="message-log">
        <h3>Status</h3>
        <div v-if="realtimestore.RelayStatus">
          <div class="peers">
            <strong>User Devices:</strong>
            <ul>
              <li
                v-for="key in Object.keys(realtimestore.RelayStatus.UserPeers)"
                :key="key">
                {{ realtimestore.RelayStatus.UserPeers[key] }} 
                <span v-if="key === realtimestore.RelayStatus.CurrentClient">(Current Client)</span>
                <span v-if="key === realtimestore.RelayStatus.CurrentClient" class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7.5 1.5h-11a5 5 0 0011 0zm-4-1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6.5 5a4.5 4.5 0 109 0h-9z"/></svg></span>
                <span v-else><button @click="testtransfer(key)"class="custom-button">TransferTEST</button></span>
              </li>
            </ul>
          </div>
          <div class="peers">
            <strong>Console Devices:</strong>
            <ul>
              <li
                v-for="peer in realtimestore.RelayStatus.ConsolePeers"
                :key="peer">
                {{ peer }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>No data available</p>
        </div>
      </div>
  </template>
  
  <style scoped>
  button {
    display: inline-block;
    padding: 12px 24px;
    margin: 12px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .custom-button{
    background-color: #4CAF50; /* 新しいボタンの背景色 */
    font-size: 10px; /* フォントサイズを大きく */
    padding: 8px ; /* パディングを大きく */
    border-radius: 10px; /* 角を丸くする */
  }
  
  button:hover {
    background-color: #45a049;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  button:active {
    background-color: #3e8e41;
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .message-log {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-top: 20px;
    max-height: 400px;
    max-width: 100%;
    overflow-y: auto;
    color: #333;
  }
  
  .message-log h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
  }
  
  .peers {
    margin-bottom: 15px;
  }
  
  .peers strong {
    display: block;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #4CAF50;
  }
  
  .message-log ul {
    list-style-type: none;
    padding: 0;
  }
  
  .message-log li {
    position:relative;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .message-log li.current {
    background-color: #e0f7fa;
    color: #00796b;
  }
  
  .message-log li:hover {
    transform: scale(1.02);
    background-color: #f1f1f1;
  }
  
  .message-log li span {
    font-size: 12px;
    color: #777;
  }
  
  .message-log li.current span {
    color: #00796b;
  }
  .icon {
    position: absolute;
    top: 60%;
    left: 90%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
      animation: bounce 1s infinite ease-in-out; /* バウンドする動き */
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(-50%) translateY(0);
      }
      50% {
        transform: translateY(-50%) translateY(-10px); /* 少し上にバウンド */
      }
    }

svg {
    fill: #00d4ff;
}
  </style>
  