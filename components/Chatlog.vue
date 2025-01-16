<script setup lang="ts">
import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder } from 'wavtools';
import type { ItemType } from '../utils/lib/client.js';
import nomadconfig from '../nomadconfig.json';

// クライアントインスタンス・オーディオインスタンス初期化
const clientRef = ref<RealtimeClient | null>(null);
    
// イベントアイテム初期化
const items = ref<ItemType[]>([]);
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
  if (!client) return;
  client.disconnect();
  isConnected.value=false;
}
// クライアント・オーディオインスタンス初期化、RealtimeAPIのサーバーイベントハンドラ
function setClient() {
  const url = 'wss://'+nomadconfig.IPadress+':3000/relay?id=user123&role=user'
  clientRef.value = new RealtimeClient({ 
    url: url
  });
  const client = clientRef.value;
  if (!client) return;
  // オーディオ再生
  client.on('conversation.updated', async ({ item, delta }: any) => {
    //console.log('conversation.updated');
    const Items = client.conversation.getItems();
    if (item.status === 'completed' && item.formatted.audio?.length) {
      const wavFile = await WavRecorder.decode(
        item.formatted.audio,
        24000,
        24000
      );
      item.formatted.file = wavFile;
    }
    const latestItem = Items[Items.length - 1]; // 最新の要素を取得
    if (latestItem && !items.value.some(existingItem => existingItem.id === latestItem.id)) {
      items.value.push(latestItem);
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
      <div class="content-block-title">conversation</div>
      <div class="content-block-body" data-conversation-content>
        <!-- 会話がない場合 -->
        <div v-if="!items.length">awaiting connection...</div>

        <!-- 会話リスト -->
        <div
          v-for="conversationItem in items"
          :key="conversationItem.id"
          class="conversation-item"
        >
          <div :class="['speaker', conversationItem.role || '']">
            <div>
              {{ (conversationItem.role || conversationItem.type).replaceAll('_', ' ') }}
            </div>
          </div>

          <div class="speaker-content">
            <!-- tool response -->
            <div v-if="conversationItem.type === 'function_call_output'">
              {{ conversationItem.formatted.output }}
            </div>

            <!-- tool call -->
            <div v-if="conversationItem.formatted.tool">
              {{ conversationItem.formatted.tool.name }}(
              {{ conversationItem.formatted.tool.arguments }})
            </div>

            <!-- user message -->
            <div
              v-if="!conversationItem.formatted.tool && conversationItem.role === 'user'"
            >
              {{ conversationItem.formatted.transcript ||
                (conversationItem.formatted.audio?.length
                  ? '(awaiting transcript)'
                  : conversationItem.formatted.text || '(item sent)') }}
            </div>

            <!-- assistant response -->
            <div
              v-if="!conversationItem.formatted.tool && conversationItem.role === 'assistant'"
            >
              {{ conversationItem.formatted.transcript ||
                conversationItem.formatted.text || '(truncated)' }}
            </div>

            <!-- audio file -->
            <audio
              v-if="conversationItem.formatted.file"
              :src="conversationItem.formatted.file.url"
              controls
            ></audio>
          </div>
        </div>
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
.audio-waveform {
  display: flex;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
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
.content-block-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.content-block-body {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
}

.no-connection {
  text-align: center;
  color: #777;
  font-style: italic;
  margin: 1rem 0;
}

.conversation-item {
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.speaker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.speaker.user {
  color: #007bff;
}

.speaker.assistant {
  color: #28a745;
}

.role {
  font-size: 1rem;
}

.close {
  cursor: pointer;
  color: #d9534f;
  font-size: 1.2rem;
}

.speaker-content {
  padding-left: 1rem;
  color: #555;
  font-size: 0.9rem;
}

.tool-output {
  color: #6c757d;
}

.tool-call {
  color: #ffc107;
}

.user-message {
  color: #0056b3;
}

.assistant-response {
  color: #155724;
}

audio {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
