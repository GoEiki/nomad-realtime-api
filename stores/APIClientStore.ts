// stores/messages.js
import { defineStore } from 'pinia';
import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder} from 'wavtools';
import { WavStreamPlayer } from 'wavtools';
import type { ItemType } from '../utils/lib/client.js';
export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}
export interface ServerStatus{
  UserPeers: {[id: string]: string };
  ConsolePeers: {[id: string]: string };
  CurrentClient: string|null;
}
export const RealtimeStore = defineStore('messages', {
  state: () => ({
    realtimeEvents:  [] as RealtimeEvent[], // Realtime API のイベントを保存
    client: null as RealtimeClient | null, // Realtime API クライアント
    wavRecorder: null as WavRecorder | null, // 録音インスタンス
    wavStreamPlayer: null as WavStreamPlayer | null, // 再生インスタンス
    clientCanvas: undefined as HTMLCanvasElement | undefined, // クライアントの波形描画キャンバス
    serverCanvas: undefined as HTMLCanvasElement | undefined, // サーバーの波形描画キャンバス
    isConnected: false, // Realtime API に接続状態
    isMuted: false, // ミュート状態
    items: [] as ItemType[], // 対話イベントアイテム
    NomadEvents:[] as RealtimeEvent[],// Nomadのイベント
    RelayStatus: {UserPeers:{},ConsolePeers:{},CurrentClient:null} as ServerStatus,
  }),
  actions: {
    toggleMute(){
      this.isMuted = !this.isMuted;
    },
    clearState() {
      this.realtimeEvents = [];
      this.items = [];
      this.RelayStatus = {UserPeers:{},ConsolePeers:{},CurrentClient:null};
    }
  },
});

