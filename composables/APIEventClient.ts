import { RealtimeStore } from '@/stores/APIClientStore';
import { RealtimeClient } from '../utils/lib/client.js';
import type { RealtimeEvent } from '@/stores/APIClientStore';
export const ConnectEventClient = () => {
    const config = useRuntimeConfig();
    const realtimestore = RealtimeStore(); // Pinia ストアを取得
    // Realtime APIに接続・オーディオ開始
    async function connectConversation() {
        const client = realtimestore.client;
        if (!client) return;
        await client.connect();
        realtimestore.isConnected = true;
    };
    // Realtime APIから切断・オーディオ終了
    async function disconnectConversation() {
        const client = realtimestore.client;
        if (!client) return;
        client.disconnect();
        realtimestore.isConnected = false;
    }
    // クライアント・オーディオインスタンス初期化
    function setClient() {
        realtimestore.client = new RealtimeClient({
            url: 'wss://' + config.public.DefaultIPAdress + '/relay?id=' + config.public.DefaultUserID + '&role=console'+'&name=StateManager'
        });
    };
    // RealtimeAPIのサーバーイベントハンドラ
    function ConversationHandler() {
        if (!realtimestore.client) return;
        const client = realtimestore.client;
        if (!client) return;
        client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
            const lastEvent = realtimestore.realtimeEvents[realtimestore.realtimeEvents.length - 1];
            if (lastEvent?.event.type === realtimeEvent.event.type) {
                lastEvent.count = (lastEvent.count || 0) + 1;
                realtimestore.realtimeEvents = realtimestore.realtimeEvents.slice(0, -1).concat(lastEvent);
            } else {
                realtimestore.addEvent(realtimeEvent);
            }
            if (realtimeEvent.event.type === 'error') {
                console.error(realtimeEvent.event);
            }
            if(realtimeEvent.event.type === 'response.done' || realtimeEvent.event.type === 'response.function_call_arguments.done'||realtimeEvent.event.type === 'response.function_call-arguments.delta'){
                realtimestore.addFunctionEvent(realtimeEvent);
            }
            if(realtimeEvent.event.type === 'nomad.event'){
                realtimestore.addNomadEvent(realtimeEvent);
            }
        });

        client.on('error', (event: any) => console.error(event));
    };
    return {
        connectConversation,
        disconnectConversation,
        setClient,
        ConversationHandler,
    };
};
