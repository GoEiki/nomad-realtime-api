import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder} from 'wavtools';
import { WavStreamPlayer } from 'wavtools';
import { WavRenderer} from '../utils/wav_renderer';
import type { ItemType } from '../utils/lib/client.js';
import {RealtimeStore} from '../stores/APIClientStore';
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}
const config = useRuntimeConfig();
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
const messageLogRef = ref<HTMLCanvasElement | undefined>(undefined);
const conversationLogRef = ref<HTMLCanvasElement | undefined>(undefined);

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
// クライアント・オーディオインスタンス初期化、RealtimeAPIのサーバーイベントハンドラ
function setClient() {
  clientRef.value = new RealtimeClient({ 
    url: 'wss://'+config.public.DefaultAdress+'/relay?id='+config.public.DefaultUserID+'&role=user'
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
    const latestItem = Items[Items.length - 1]; // 最新の要素を取得
    if (latestItem) {
      const lastItemIndex = items.value.length - 1;
      if (items.value.length > 0 && items.value[lastItemIndex].id === latestItem.id) {
        // idが同じ場合、配列の最後の要素を更新
        items.value=items.value.slice(0, -1).concat(latestItem);
      } else {
        // idが異なる場合、新しい要素を追加
        items.value.push(latestItem);
      }
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
    if(realtimeEvent.event.type === 'error'){
      console.error(realtimeEvent.event);
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
watch(realtimeEvents, () => {
  const messageLog = messageLogRef.value;
  if (messageLog) {
    messageLog.scrollTop = messageLog.scrollHeight;
  }
});
watch(items, () => {
  const messageLog = conversationLogRef.value;
  if (messageLog) {
    messageLog.scrollTop = messageLog.scrollHeight;
  }
});
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

