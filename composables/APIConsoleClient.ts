// composables/useWebSocket.js
import { RealtimeStore } from '@/stores/APIClientStore';
import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder } from 'wavtools';
import { WavStreamPlayer } from 'wavtools';
import type { RealtimeEvent } from '@/stores/APIClientStore';
export const ConnectConsole = () => {
    const config = useRuntimeConfig();
    const realtimestore = RealtimeStore(); // Pinia ストアを取得
    // Realtime APIに接続・オーディオ開始
    async function connectConversation() {
        const client = realtimestore.client;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        if (!client || !wavStreamPlayer) return;
        await wavStreamPlayer.connect();
        await client.connect();
        realtimestore.isConnected = true;
    };
    // Realtime APIから切断・オーディオ終了
    async function disconnectConversation() {
        const client = realtimestore.client;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        if (!client || !wavStreamPlayer) return;
        client.disconnect();
        wavStreamPlayer.interrupt();
        realtimestore.isConnected = false;
    }
    // クライアント・オーディオインスタンス初期化
    function setClient() {
        realtimestore.client = new RealtimeClient({
            url: 'wss://' + config.public.DefaultIPAdress + '/relay?id=' + config.public.DefaultUserID + '&role=console'
        });
        realtimestore.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    };
    // RealtimeAPIのサーバーイベントハンドラ
    function ConversationHandler() {
        if (!realtimestore.client || !realtimestore.wavStreamPlayer) return;
        const client = realtimestore.client;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        if (!client || !wavStreamPlayer) return;

        // オーディオ再生
        client.on('conversation.updated', async ({ item, delta }: any) => {
            const Items = client.conversation.getItems();
            if (delta?.audio && !realtimestore.isMuted) {
                wavStreamPlayer.add16BitPCM(delta.audio, item.id);
            }
            const latestItem = Items[Items.length - 1]; // 最新の要素を取得
            if (latestItem) {
                const lastItemIndex = realtimestore.items.length - 1;
                if (realtimestore.items.length > 0 && realtimestore.items[lastItemIndex].id === latestItem.id) {
                    // idが同じ場合、配列の最後の要素を更新
                    realtimestore.items = realtimestore.items.slice(0, -1).concat(latestItem);
                } else {
                    // idが異なる場合、新しい要素を追加
                    realtimestore.addItem(latestItem);
                }
            }
        });
        watch(
            () => realtimestore.isMuted,
            (isMuted) => {
                if (isMuted) {
                    wavStreamPlayer.interrupt();
                }
            }
        );
        // オーディオ停止
        client.on('conversation.interrupted', async () => {
            const trackSampleOffset = await wavStreamPlayer.interrupt();
        });

        client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
            const lastEvent = realtimestore.realtimeEvents[realtimestore.realtimeEvents.length - 1];
            if (lastEvent?.event.type === realtimeEvent.event.type) {
                // if we receive multiple events in a row, aggregate them for display purposes
                lastEvent.count = (lastEvent.count || 0) + 1;
                realtimestore.realtimeEvents = realtimestore.realtimeEvents.slice(0, -1).concat(lastEvent);
            } else {
                realtimestore.addEvent(realtimeEvent);
            }
            if (realtimeEvent.event.type === 'error') {
                console.error(realtimeEvent.event);
            }
            if (realtimeEvent.event.type === 'nomad.event') {
                realtimestore.addNomadEvent(realtimeEvent);
                if (realtimeEvent.event.event === 'relay.event') {
                    realtimestore.RelayStatus.APIconnection = realtimeEvent.event.data.APIconnection;
                    realtimestore.RelayStatus.UserPeers = realtimeEvent.event.data.userpeers;
                    realtimestore.RelayStatus.ConsolePeers = realtimeEvent.event.data.consolepeers;
                    realtimestore.RelayStatus.CurrentClient = realtimeEvent.event.data.CurrentClient;
                }

            }
        });

        client.on('error', (event: any) => console.error(event));
    };
    function NomadEventsHandler() {

    }


    return {
        connectConversation,
        disconnectConversation,
        setClient,
        ConversationHandler,
        NomadEventsHandler
    };
};
