<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
import { StateManager } from '@/composables/StateManager';
import { ConnectEventClient } from '@/composables/APIEventClient';
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const { setStateManager, reset, reloadtasks } = StateManager();
const { connectConversation, disconnectConversation, ConversationHandler, setClient } = ConnectEventClient();

onMounted(() => {
  setClient();
  ConversationHandler();
  setStateManager();
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
</script>
<template>
  <button @click="toggleConnection"
    :style="{ backgroundColor: !realtimestore.isConnected ? '#4CAF50' : '#cc4d4d', color: '#fff' }">
    {{ realtimestore.isConnected ? 'disconnect' : 'connect' }}
  </button>
  <button @click="reset">
    Reset Queue
  </button>
  <button @click="reloadtasks">
    Reload Basic Tasks
  </button>

</template>

<style scoped>

</style>
