import { WebSocket } from 'ws';

const peers: { [id: string]: any } = {}; // クライアント接続を管理するオブジェクト
const connections: { [id: string]: {connection:WebSocket,count:number }} = {};//ユーザーごとにAPIとの接続を管理、countは同一ユーザーのクライアント接続数
console.log('relay server starting');
export default defineWebSocketHandler({
  open(peer) {
    if (!peer.websocket.url) {
      console.error('WebSocket URL is undefined');
      peer.close();
      return;
    }
    console.log(peer.id);
    console.log(peer.websocket.url);
    const url = new URL(peer.websocket.url);  // URLオブジェクトを使ってクエリパラメータを解析
    const userId = url.searchParams.get('id');  // idをクエリパラメータから取得
    console.log(userId);
    if (!userId) {
      console.error('User ID is required');
      peer.close();
      return;
    }
    if (!connections[userId]) {
      // OpenAIのRealtime APIとの接続
      const APIurl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17';
      connections[userId] = {connection:new WebSocket(APIurl, {
        headers: {
          'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
          'OpenAI-Beta': 'realtime=v1',
        },
      }),count:1};
    
      const instructions = '博多弁で話してください。';
      connections[userId].connection.on('open', () => {
        // Realtime APIのセッション設定
        connections[userId].connection.send(JSON.stringify({
          type: 'session.update',
          session: {
            voice: 'shimmer',
            instructions: instructions,
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: { type: 'server_vad' },
          },
        }));
      });
    }
    else{
      //ユーザーIDが同じならクライアント接続数を+1
      connections[userId].count++;
    }
    // クライアント接続を管理
    peers[peer.id] = peer;
    connections[userId].connection.on('message', (message) => {
      // Realtime APIのサーバーイベントはそのままクライアントに返す
      peer.send(message.toString());
    });
    
  },
  message(peer, message) {
    if (!peer.websocket.url) {
      console.error('WebSocket URL is undefined');
      peer.close();
      return;
    }
    const url = new URL(peer.websocket.url);  // URLオブジェクトを使ってクエリパラメータを解析
    const userId = url.searchParams.get('id');  // idをクエリパラメータから取得
    if (!userId) {
      console.error('User ID is required');
      peer.close();
      return;
    }
    const parsedMessage = JSON.parse(message.text());
    console.log(parsedMessage['type']);
    if(parsedMessage['type'] === 'nomad.event'){
      console.log('nomad_event');
    }
    else{
      // クライアントイベントはそのままRealtime APIに中継する
      if (connections[userId].connection.readyState === WebSocket.OPEN) {
        connections[userId].connection.send(message.text());
      }
      else{
        console.log('connection is not open');
      }
    }
    // 他のクライアントにもメッセージを送信
    Object.keys(peers).forEach(id => {
      if (id !== peer.id) {
        peers[id].send(message.text());
      }
    });

  },
  close(peer) {
    if (!peer.websocket.url) {
      console.error('WebSocket URL is undefined');
      peer.close();
      return;
    }
    const url = new URL(peer.websocket.url);  // URLオブジェクトを使ってクエリパラメータを解析
    const userId = url.searchParams.get('id');  // idをクエリパラメータから取得
    if (!userId) {
      console.error('User ID is required');
      peer.close();
      return;
    }
    if(connections[userId].count>1){
      connections[userId].count--;
      return;
    }
    connections[userId].connection.close();
    delete connections[userId];
    console.log('closed websocket');
  },
  error(peer, error) {
    console.log('error', { error, id: peer.id });
  },
});
