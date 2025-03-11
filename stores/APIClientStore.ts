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
    FunctionEvents:[] as RealtimeEvent[],// FunctionCall用イベント
    RelayStatus: {UserPeers:{},ConsolePeers:{},CurrentClient:null} as ServerStatus,
  }),
  actions: {
    toggleMute(){
      this.isMuted = !this.isMuted;
    },
    clearState() {
      this.realtimeEvents = [];
      this.NomadEvents = [];
      this.items = [];
      this.RelayStatus = {UserPeers:{},ConsolePeers:{},CurrentClient:null};
    },
    addItem(item:ItemType) {
      this.items.push(item);
      const MAX_ITEMS = 100; // 最大30件まで
      if (this.items.length > MAX_ITEMS) {
        this.items.shift(); // 先頭を削除（古いデータを消す）
      }
    },
    addEvent(event:RealtimeEvent){
      this.realtimeEvents.push(event);
      const MAX_EVENTS = 200; // 最大30件まで
      if (this.realtimeEvents.length > MAX_EVENTS) {
        this.realtimeEvents.shift(); // 先頭を削除（古いデータを消す）
      }
    },
    addNomadEvent(event:RealtimeEvent){
      console.log(event);
      this.NomadEvents.push(event);
      const MAX_EVENTS = 30; // 最大30件まで
      if (this.NomadEvents.length > MAX_EVENTS) {
        this.NomadEvents.shift(); // 先頭を削除（古いデータを消す）
      }
    },
    addFunctionEvent(event:RealtimeEvent){
      this.FunctionEvents.push(event);
      const MAX_EVENTS = 30; // 最大30件まで
      if (this.FunctionEvents.length > MAX_EVENTS) {
        this.FunctionEvents.shift(); // 先頭を削除（古いデータを消す）
        }
      },
    sendEvent(eventtype: string, data: any) {
      this.client?.sendNomadEvent({ event: eventtype, data });
    }
  },
});

