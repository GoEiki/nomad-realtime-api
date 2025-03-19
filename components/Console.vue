<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
import { ConnectConsole } from '@/composables/APIConsoleClient';
const realtimestore = RealtimeStore(); // Pinia ストアを取得

const { connectConversation, disconnectConversation, setClient, ConversationHandler, NomadEventsHandler } = ConnectConsole();
onMounted(() => {
    setClient();
    ConversationHandler();
    NomadEventsHandler();
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
function transfer(name:string,id:string) {
  const client = realtimestore.client;
  if(client){
    client.sendNomadEvent({ event: 'Task_TransferBasic',data:{newDeviceName:name,newClientID:id} });
  }
}
function toggleAPIconnection() {
  if (realtimestore.RelayStatus.APIconnection) {
    realtimestore.client?.sendNomadEvent({ event: 'close.event' });
  } else {
    realtimestore.client?.sendNomadEvent({ event: 'open.event' });
  }
}
</script>
<template>
      <button @click="toggleConnection":style="{backgroundColor: !realtimestore.isConnected ? '#4CAF50' : '#cc4d4d', color: '#fff'}">
        {{ realtimestore.isConnected ? '切断' : '接続' }}
      </button>
      <button @click="toggleAPIconnection":style="{backgroundColor: !realtimestore.RelayStatus.APIconnection ? '#007bff' : '#cc4d4d', color: '#fff'}">
        {{ realtimestore.RelayStatus.APIconnection ? 'API CLOSE' : 'API OPEN' }}
      </button>
      <button @click="realtimestore.clearState">
        クリア
      </button>
      <button @click="realtimestore.toggleMute" :style="{backgroundColor: realtimestore.isMuted ? '#4CAF50' : '#808080', color: '#fff'}">
        {{ realtimestore.isMuted ? 'MUTE' : 'MUTE' }}
      </button>
      <div class="message-log">
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
                <span v-else><button @click="testtransfer(key)"class="custom-button">Transfer</button><button @click="transfer(realtimestore.RelayStatus.UserPeers[key],key)"class="custom-button">Transfer Basic</button></span>
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
  .custom-button {
    background-color: #4CAF50;
    font-size: 10px;
    padding: 8px;
    border-radius: 10px;
  }
  
  .icon {
    position: absolute;
    top: 60%;
    left: 90%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    animation: bounce 1s infinite ease-in-out;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(-50%) translateY(0);
    }
    50% {
      transform: translateY(-50%) translateY(-10px);
    }
  }
  
  svg {
    fill: #00d4ff;
  }
  </style>
