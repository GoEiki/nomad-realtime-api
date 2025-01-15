<script setup lang="ts">
import { RealtimeClient } from '../utils/lib/client.js';
import { WavStreamPlayer } from 'wavtools';
import { WavRenderer} from '../utils/wav_renderer.js';
// クライアントインスタンス・オーディオインスタンス初期化
const clientRef = ref<RealtimeClient | null>(null);
const wavStreamPlayerServerRef = ref<WavStreamPlayer | null>(null);
const wavStreamPlayerClientRef = ref<WavStreamPlayer | null>(null);
const clientCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
const serverCanvasRef = ref<HTMLCanvasElement | undefined>(undefined);
// イベントアイテム初期化
const isConnected = ref(false);
// Realtime APIに接続・オーディオ開始
async function connectConversation() {
  const client = clientRef.value;
  const wavStreamPlayerServer = wavStreamPlayerServerRef.value;
  const wavStreamPlayerClient = wavStreamPlayerClientRef.value;
  if (!client || !wavStreamPlayerServer || !wavStreamPlayerClient) return;
  await wavStreamPlayerServer.connect();
  await wavStreamPlayerClient.connect();
  await client.connect();
  isConnected.value=true;
}
// Realtime APIから切断・オーディオ終了
async function disconnectConversation() {
  const client = clientRef.value;
  const wavStreamPlayerServer = wavStreamPlayerServerRef.value;
  const wavStreamPlayerClient = wavStreamPlayerClientRef.value;
  if (!client || !wavStreamPlayerServer || !wavStreamPlayerClient) return;
  client.disconnect();
  wavStreamPlayerServer.interrupt();
  wavStreamPlayerClient.interrupt();
  isConnected.value=false;
}
// クライアント・オーディオインスタンス初期化、RealtimeAPIのサーバーイベントハンドラ
function setClient() {
  clientRef.value = new RealtimeClient({ 
    url: 'wss://10.0.1.56:3000/relay?id=user123&role=console' 
  });
  wavStreamPlayerServerRef.value = new WavStreamPlayer({ sampleRate: 24000 });
  wavStreamPlayerClientRef.value = new WavStreamPlayer({ sampleRate: 24000 });
  const client = clientRef.value;
  const wavStreamPlayerServer = wavStreamPlayerServerRef.value;
  const wavStreamPlayerClient = wavStreamPlayerClientRef.value;
  if (!client || !wavStreamPlayerServer || !wavStreamPlayerClient) return;

  // オーディオ再生
  client.on('conversation.updated', async ({ item, delta }: any) => {
    if (delta?.audio) {
      wavStreamPlayerServer.add16BitPCM(delta.audio, item.id);
    }
  });
  client.on('input_audio_buffer.append', async ({ item, delta }: any) => {
    console.log('input_audio_buffer.append');
    if (delta?.audio) {
      wavStreamPlayerClient.add16BitPCM(delta.audio, item.id);
    }
  });
  // オーディオ停止
  client.on('conversation.interrupted', async () => {
    wavStreamPlayerServer.interrupt();
  });

  client.on('error', (event: any) => console.error(event));
}
function setCanvas(){
  const clientCanvas = clientCanvasRef.value;
  const serverCanvas = serverCanvasRef.value;
  const wavStreamPlayerServer = wavStreamPlayerServerRef.value;
  const wavStreamPlayerClient = wavStreamPlayerClientRef.value;
  //console.log('canvas instances loaded')
  let clientCtx: CanvasRenderingContext2D | null = null;
  let serverCtx: CanvasRenderingContext2D | null = null;
  //console.log('canvas contexts loaded')
  const render = () => {
    if (clientCanvas) {
      if (!clientCanvas.width || !clientCanvas.height) {
        clientCanvas.width = clientCanvas.offsetWidth;
        clientCanvas.height = clientCanvas.offsetHeight;
      }
      clientCtx = clientCtx || clientCanvas.getContext('2d');
      if (clientCtx) {
        clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
        if(wavStreamPlayerClient){
          const result = wavStreamPlayerClient.analyser
            ? wavStreamPlayerClient.getFrequencies('voice')
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
        if(wavStreamPlayerServer){
          const result = wavStreamPlayerServer.analyser
            ? wavStreamPlayerServer.getFrequencies('voice')
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
      <!--
      <div class="audio-waveform">
        <h3>音声波形</h3>
        <canvas ref="clientCanvasRef" width="600" height="150"></canvas>
      </div>
    -->
      <div class="audio-waveform">
        <h3>音声波形</h3>
        <canvas ref="serverCanvasRef" width="600" height="150"></canvas>
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
</style>
