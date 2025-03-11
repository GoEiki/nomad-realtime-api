// composables/useWebSocket.js
import { RealtimeStore } from '@/stores/APIClientStore';
import { RealtimeClient } from '../utils/lib/client.js';
import { WavRecorder } from 'wavtools';
import { WavStreamPlayer } from 'wavtools';
import type { RealtimeEvent } from '@/stores/APIClientStore';
export const ConnectUser = () => {
    const config = useRuntimeConfig();
    const realtimestore = RealtimeStore(); // Pinia ストアを取得
    // Realtime APIに接続・オーディオ開始
    async function connectConversation() {
        const client = realtimestore.client;
        const wavRecorder = realtimestore.wavRecorder;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        if (!client || !wavRecorder || !wavStreamPlayer) return;
        await wavRecorder.begin();
        await wavStreamPlayer.connect();
        await client.connect();
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
        realtimestore.isConnected = true;
    };
    // Realtime APIから切断・オーディオ終了
    async function disconnectConversation() {
        const client = realtimestore.client;
        const wavRecorder = realtimestore.wavRecorder;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        if (!client || !wavRecorder || !wavStreamPlayer) return;
        client.disconnect();
        await wavRecorder.end();
        wavStreamPlayer.interrupt();
        realtimestore.isConnected = false;
    }
    // クライアント・オーディオインスタンス初期化
    function setClient(name?: string) {
        if (name) {
            realtimestore.client = new RealtimeClient({
                url: 'wss://' + config.public.DefaultIPAdress + '/relay?id=' + config.public.DefaultUserID + '&role=user' + '&name=' + name
            });
        } else {
            realtimestore.client = new RealtimeClient({
                url: 'wss://' + config.public.DefaultIPAdress + '/relay?id=' + config.public.DefaultUserID + '&role=user'
            });
        }
        realtimestore.wavRecorder = new WavRecorder({ sampleRate: 24000 });
        realtimestore.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
    };
    // RealtimeAPIのサーバーイベントハンドラ
    function ConversationHandler() {
        if (!realtimestore.client || !realtimestore.wavStreamPlayer || !realtimestore.wavRecorder) return;
        const client = realtimestore.client;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        const wavRecorder = realtimestore.wavRecorder;
        if (!client || !wavStreamPlayer || !wavRecorder) return;

        // オーディオ再生
        client.on('conversation.updated', async ({ item, delta }: any) => {
            const Items = client.conversation.getItems();
            if (delta?.audio) {
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

        // オーディオ停止
        client.on('conversation.interrupted', async () => {
            const trackSampleOffset = await wavStreamPlayer.interrupt();
            if (trackSampleOffset?.trackId) {
                const { trackId, offset } = trackSampleOffset;
                await client.cancelResponse(trackId, offset);
            }
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
            }
        });

        client.on('error', (event: any) => console.error(event));
    };
    // キャンバス描画
    function setCanvas(ClientCanvas: HTMLCanvasElement, ServerCanvas: HTMLCanvasElement) {
        realtimestore.clientCanvas = ClientCanvas;
        realtimestore.serverCanvas = ServerCanvas;
        const clientCanvas = realtimestore.clientCanvas;
        const serverCanvas = realtimestore.serverCanvas;
        const wavStreamPlayer = realtimestore.wavStreamPlayer;
        const wavRecorder = realtimestore.wavRecorder;
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
                    if (wavRecorder) {
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
                    if (wavStreamPlayer) {
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
    return {
        connectConversation,
        disconnectConversation,
        setClient,
        ConversationHandler,
        setCanvas
    };
};
