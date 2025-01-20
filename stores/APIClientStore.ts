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
export const RealtimeStore = defineStore('messages', {
  state: () => ({
    realtimeEvents:  [] as RealtimeEvent[], // Realtime API のイベントを保存
    client: null as RealtimeClient | null, // Realtime API クライアント
    wavRecorder: null as WavRecorder | null, // 録音インスタンス
    wavStreamPlayer: null as WavStreamPlayer | null, // 再生インスタンス
    clientCanvas: undefined as HTMLCanvasElement | undefined, // クライアントの波形描画キャンバス
    serverCanvas: undefined as HTMLCanvasElement | undefined, // サーバーの波形描画キャンバス
    isConnected: false, // Realtime API に接続しているかどうか
    items: [] as ItemType[], // イベントアイテム
  }),
  actions: {
    ScrollToBottom(element: HTMLElement,instance: any) {
      watch(instance, (newValue, oldValue)=> {
        console.log('scroll to bottom2', newValue, oldValue);
        if(element){
          if(true){
            element.scrollTop = element.scrollHeight;
          }
        }
      },{ deep: true });
    }
  },
});

