<script setup lang="ts">
import { RealtimeClient } from '../utils/lib/client.js';
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}
// クライアントインスタンス・オーディオインスタンス初期化
const clientRef = ref<RealtimeClient | null>(null);
// イベントアイテム初期化
const realtimeEvents = ref<RealtimeEvent[]>([]);
const isConnected = ref(false);
// Realtime APIに接続・オーディオ開始
async function connectConversation() {
  const client = clientRef.value;
  if (!client) return;
  await client.connect();
  isConnected.value=true;
}
// Realtime APIから切断・オーディオ終了
async function disconnectConversation() {
  const client = clientRef.value;
  if (!client ) return;
  client.disconnect();
  isConnected.value=false;
}
function testsend(){
  const client = clientRef.value;
  if(client){
    client.sendNomadEvent({ data:'hello' });
  }
}
// クライアント・オーディオインスタンス初期化、RealtimeAPIのサーバーイベントハンドラ
function setClient() {
  clientRef.value = new RealtimeClient({ 
    url: 'wss://10.0.1.56:3000/relay?id=user123&role=console'
  });
  const client = clientRef.value;
  if (!client) return;
  client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
    const lastEvent = realtimeEvents.value[realtimeEvents.value.length - 1];
    if (lastEvent?.event.type === realtimeEvent.event.type) {
      // if we receive multiple events in a row, aggregate them for display purposes
      lastEvent.count = (lastEvent.count || 0) + 1;
      realtimeEvents.value = realtimeEvents.value.slice(0, -1).concat(lastEvent);
    } else {
      realtimeEvents.value.push(realtimeEvent);
    }
  });

  client.on('error', (event: any) => console.error(event));
}
onMounted(() => {
  setClient();
});
async function toggleConnection() {
  if (isConnected.value) {
    disconnectConversation();
  } else {
    connectConversation();
  }
}
</script>

<template>
  <div>
    <div class="container">
      <button @click="toggleConnection">
        {{ isConnected ? '切断' : '接続' }}
      </button>
      <div class="message-log">
        <h3>RealTimeEvents</h3>
        <ul>
          <li v-for="(event, index) in realtimeEvents" :key="index">
            <div>{{ event.source }} : {{ event.event['type'] }}</div>
            <div v-if="event.count"> : {{ event.count }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<style scoped>
button {
  display: flex;
  padding: 10px 20px;
  background-color: #9eaf4c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
}
.message-log {
  display: flex;
  padding: 20px;
  background-color: #e9e9e9;
  border-radius: 8px;
  margin-top: 20px;
  max-height: 500px;
  max-width: 500px;
  overflow-y: auto;
}
.message-log ul {
  list-style-type: none;
  padding: 0;
}
.message-log li {
  max-width: 90%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
