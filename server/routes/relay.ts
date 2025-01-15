import { WebSocket } from 'ws';

class User {
  readonly connection: WebSocket;
  userpeers: { [id: string]: any };
  consolepeers: { [id: string]: any };
  CurrentClient: any;
  [key: string]: any;

  constructor(connection: WebSocket) {
    this.connection = connection;
    this.userpeers = this.createPeerProxy({},'UserPeer');  // userpeersにProxyを適用
    this.consolepeers = this.createPeerProxy({},'ConsolePeer');  // consolepeersにProxyを適用
    this.CurrentClient = null;

    // プロパティ変更時の通知をセット
    return new Proxy(this, {
      set: (target, property:string, value:any) => {
          target[property] = value;
          this.notifyChange(property, value);
          console.log(`${property} changed to ${value}`);
        return true;
      }
    });
  }
  createPeerProxy(peers: { [id: string]: any },Proxyname:string = '') {
    return new Proxy(peers, {
      set: (target, property: string, value: any) => {
        target[property] = value;
        this.notifyChange(property, value);
        console.log(`new ${Proxyname} added Peer ID : ${property}`);
        return true;
      },
      deleteProperty: (target, property: string) => {
        delete target[property];
        this.notifyChange(property, null); // 削除された場合はnullを通知
        console.log(`${Proxyname} deleted Peer ID : ${property} `);
        return true;
      }
    });
  }
  // JSON.stringify時に循環参照を回避するreplacer関数を追加
  private safeStringify(obj: any): string {
    return JSON.stringify(obj, (key, value) => {
      // 循環参照を防ぐため、特定のプロパティを除外する
      if (key === '_request' || key === '_req') {
        return undefined;
      }
      return value;
    });
  }
  // オブジェクトを安全にコピーするヘルパー関数
  private safeObject(obj: any) {
    return JSON.parse(this.safeStringify(obj));
  }
  notifyChange(property: string, value: any) {
    // userpeers と consolepeers の両方に通知
    const allData = {
      userpeers: this.safeObject(Object.keys(this.userpeers)),
      consolepeers: this.safeObject(Object.keys(this.consolepeers)),
      CurrentClient: this.CurrentClient,
    };
    [...Object.values(this.consolepeers)].forEach(peer => {
      try {
        // 循環参照を回避して通知
        peer.send(this.safeStringify({
          type: 'user.update',
          Property:property,
          //newValue:value,
          allData
        }));
      } catch (error) {
        console.error("Error sending update:", error);
      }
    });
  }
}


const users: { [id: string]: User } = {};
console.log('relay server starting');
export default defineWebSocketHandler({
  open(peer) {

    if (!peer.websocket.url) {
      console.error('WebSocket URL is undefined');
      peer.close();
      return;
    }
    const url = new URL(peer.websocket.url);  // URLオブジェクトを使ってクエリパラメータを解析
    const userId = url.searchParams.get('id');  // idをクエリパラメータから取得
    const role = url.searchParams.get('role');  // idをクエリパラメータから取得
    if (!userId) {
      console.error('User ID is required');
      peer.close();
      return;
    }
    if (!role) {
      console.error('role is required');
      peer.close();
      return;
    }
    console.log((`new connection ( User ID:${userId} Role: ${role} Peer ID: ${peer.id}`));

    //ユーザーIDが存在しなければ新しい接続を作成
    if (!users[userId]) {
      // OpenAIのRealtime APIとの接続
      const APIurl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17';
      users[userId] = new User (
        new WebSocket(APIurl, {
          headers: {
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
            'OpenAI-Beta': 'realtime=v1',
          },
        }),
      );
      const instructions = 'ユーザーをサポートしてください。';
      users[userId].connection.on('open', () => {
        // Realtime APIのセッション設定
        users[userId].connection.send(JSON.stringify({
          type: 'session.update',
          session: {
            voice: 'shimmer',
            instructions: instructions,
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: { type: 'server_vad' },
          },
        }));
      });
      console.log('opened API connection');
      //クライアントを追加
      if(role === 'console'){
        users[userId].consolepeers[peer.id] = peer;
      }
      else if(role === 'user'){
        users[userId].userpeers[peer.id] = peer;
        users[userId].CurrentClient = peer.id;
      }
    }
    else{
      if(role === 'console'){
        users[userId].consolepeers[peer.id] = peer;
      }
      else if(role === 'user'){
        users[userId].userpeers[peer.id] = peer;
        users[userId].CurrentClient = peer.id;
      }
    }
    users[userId].connection.on('message', (message) => {
      // Realtime APIのサーバーイベントはそのままクライアントに返す
      if(role === 'console'){
        peer.send(message.toString());

      }
      else if(role === 'user' && users[userId].CurrentClient === peer.id){
        peer.send(message.toString());
        
      }
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
    if(parsedMessage['type'] === 'nomad.event'){
      if(parsedMessage['event'] === 'transfer.event'){
        const userPeerIds = Object.keys(users[userId].userpeers);
        if (userPeerIds.length > 0) {
          const randomIndex = Math.floor(Math.random() * userPeerIds.length);
          users[userId].CurrentClient = userPeerIds[randomIndex];
        }
      }
      console.log('nomad_event');
    }
    else{
      // クライアントイベントはそのままRealtime APIに中継する
      if(users[userId].CurrentClient === peer.id){
        if (users[userId].connection.readyState === WebSocket.OPEN) {
          users[userId].connection.send(message.text());
        }
      }
    }
    // コンソールクライアントにメッセージを送信
    Object.keys(users[userId].consolepeers).forEach(id => {
      if (id !== peer.id) {
        users[userId].consolepeers[id].send(message.text());
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
    if(users[userId].userpeers[peer.id]){
      delete users[userId].userpeers[peer.id];
    }
    else if(users[userId].consolepeers[peer.id]){
      delete users[userId].consolepeers[peer.id];
    }
    console.log((`Peer ${peer.id} disconnected`));
    if(Object.keys(users[userId].userpeers).length === 0&&Object.keys(users[userId].consolepeers).length === 0){
      users[userId].connection.close();
      delete users[userId];
      console.log('Final peer disconnected');
      console.log('closed API connection');
    }
  },
  error(peer, error) {
    console.log('error', { error, id: peer.id });
  },
});
