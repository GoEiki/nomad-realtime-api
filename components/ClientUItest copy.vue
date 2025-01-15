<script setup lang="ts">
import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder} from 'wavtools';
import { WavStreamPlayer } from 'wavtools';
import { WavRenderer} from '../utils/wav_renderer';
import type { ItemType } from '../utils/lib/client.js';

interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

// クライアントインスタンス・オーディオインスタンス初期化
const clientRef = ref<RealtimeClient | null>(null);
const wavRecorderRef = ref<WavRecorder | null>(null);
const wavStreamPlayerRef = ref<WavStreamPlayer | null>(null);
const clientCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const serverCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
    
// イベントアイテム初期化
const realtimeEvents = ref<RealtimeEvent[]>([]);
const items = ref<ItemType[]>([]);
const isConnected = ref(false);


// Realtime APIに接続・オーディオ開始
async function connectConversation() {
  const client = clientRef.value;
  const wavRecorder = wavRecorderRef.value;
  const wavStreamPlayer = wavStreamPlayerRef.value;
  
  if (!client || !wavRecorder || !wavStreamPlayer) return;

  await wavRecorder.begin();
  await wavStreamPlayer.connect();
  await client.connect();
  await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  isConnected.value=true;
}

// Realtime APIから切断・オーディオ終了
async function disconnectConversation() {
  const client = clientRef.value;
  const wavRecorder = wavRecorderRef.value;
  const wavStreamPlayer = wavStreamPlayerRef.value;
  if (!client || !wavRecorder || !wavStreamPlayer) return;

  client.disconnect();
  await wavRecorder.end();
  await wavStreamPlayer.interrupt();
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
    url: 'wss://10.0.1.56:3000/relay?id=user123&role=user'
  });
  wavRecorderRef.value = new WavRecorder({ sampleRate: 24000 });
  wavStreamPlayerRef.value = new WavStreamPlayer({ sampleRate: 24000 });

  const client = clientRef.value;
  const wavStreamPlayer = wavStreamPlayerRef.value;
  const wavRecorder = wavRecorderRef.value;
  if (!client || !wavStreamPlayer || !wavRecorder) return;

  // オーディオ再生
  client.on('conversation.updated', async ({ item, delta }: any) => {
    const Items = client.conversation.getItems();
    if (delta?.audio) {
      wavStreamPlayer.add16BitPCM(delta.audio, item.id);
    }
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

  // オーディオ停止
  client.on('conversation.interrupted', async () => {
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
  });

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
function setCanvas(){
  const clientCanvas = clientCanvasRef.value;
  const serverCanvas = serverCanvasRef.value;
  const wavStreamPlayer = wavStreamPlayerRef.value;
  const wavRecorder = wavRecorderRef.value;
  let clientCtx: CanvasRenderingContext2D | null = null;
  let serverCtx: CanvasRenderingContext2D | null = null;
  const render = () => {
    if (clientCanvas) {
      if (!clientCanvas.width || !clientCanvas.height) {
              clientCanvas.width = clientCanvas.offsetWidth;
              clientCanvas.height = clientCanvas.offsetHeight;
      }
      clientCtx = clientCtx || clientCanvas.getContext('2d');
      if (clientCtx) {
        clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
        if(wavRecorder){
          const result = wavRecorder.recording
          ? wavRecorder.getFrequencies('voice')
          : { values: new Float32Array([0]) };
          WavRenderer.drawBars(
            clientCanvas,
            clientCtx,
            result.values,
            '#0099ff',
            10,
            0,
            8
          );
        }
      }
    }
    if (serverCanvas) {
      if (!serverCanvas.width || !serverCanvas.height) {
        serverCanvas.width = serverCanvas.offsetWidth;
        serverCanvas.height = serverCanvas.offsetHeight;
      }
      serverCtx = serverCtx || serverCanvas.getContext('2d');
      if (serverCtx) {
        serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
        if(wavStreamPlayer){
          const result = wavStreamPlayer.analyser
            ? wavStreamPlayer.getFrequencies('voice')
            : { values: new Float32Array([0]) };
          WavRenderer.drawBars(
            serverCanvas,
            serverCtx,
            result.values,
            '#009900',
            10,
            0,
            8
          );
        }
      }
    }
    window.requestAnimationFrame(render);
  }
  render();
}


onMounted(() => {
  setClient();
  setCanvas();
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
      <button @click="testsend">
        test
      </button>
      <div class="audio-waveform">
        <h3>音声波形</h3>
        <canvas ref="clientCanvasRef" width="600" height="150"></canvas>
      </div>
      <div class="audio-waveform">
        <h3>音声波形</h3>
        <canvas ref="serverCanvasRef" width="600" height="150"></canvas>
      </div>
      <div class="message-log">
        <h3>RealTimeEvents</h3>
        <ul>
          <li v-for="(event, index) in realtimeEvents" :key="index">
            <div>{{ event.source }} : {{ event.event['type'] }}</div>
            <div v-if="event.count"> : {{ event.count }}</div>
          </li>
        </ul>
      </div>
      
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
