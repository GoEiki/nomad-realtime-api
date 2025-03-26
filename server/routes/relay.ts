import { WebSocket } from 'ws';
const APIURL='wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';
const HEADERS={
  headers: {
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    'OpenAI-Beta': 'realtime=v1',
  },
};
class WebSocketRelayer {
  private APIconnection: WebSocket | null;
  readyState: typeof WebSocket.CLOSED | typeof WebSocket.OPEN;
  private callbacks: any[];
  constructor() {
    this.APIconnection = null;
    this.readyState = WebSocket.CLOSED;
    this.callbacks = [];
  }
  open(connection: WebSocket): Promise<void> {
    if (this.APIconnection) {
      console.error('API connection is already established');
      return Promise.reject('API connection is already established');
    }

    this.APIconnection = connection;

    return new Promise((resolve, reject) => {
      this.APIconnection!.on('open', () => {
        console.log('API connection established');
        this.readyState = WebSocket.OPEN;
        
        resolve(); // openイベントが発火したらPromiseを解決
      });

      this.APIconnection!.on('error', (error) => {
        console.error('Error establishing API connection:', error);
        reject(error); // エラーが発生したらPromiseを拒否
      });
      this.APIconnection!.on('message', (message) => {
        const callbacksToCall = this.callbacks;
        callbacksToCall.forEach(callback => callback(message));
      });
    });
  }


  on(event: string, callback: (data: any) => void) {
    if (event === 'message') {
      this.callbacks.push(callback);
    }
    else {
      console.error('Unsupported event type');
    }
  }
  send(message: string) {
    if (this.APIconnection) {
      this.APIconnection.send(message);
    }
    else {
      console.error('Send failed. API connection is not established');
    }
  }
  close() {
    if (this.APIconnection) {
      this.APIconnection?.close();
      this.APIconnection = null;
      this.readyState = WebSocket.CLOSED;
      console.log('API connection closed');
    }
    else {
      console.log('API connection is not established');
    }

  }

}
class User {
  readonly connection: WebSocketRelayer | WebSocket;
  userpeers: { [id: string]: { peer: any, name: string } };
  consolepeers: { [id: string]: { peer: any, name: string } };
  CurrentClient: any;
  [key: string]: any;

  constructor(connection: WebSocketRelayer | WebSocket) {
    this.connection = connection;
    this.userpeers = this.createPeerProxy({}, 'UserPeer');  // userpeersにProxyを適用
    this.consolepeers = this.createPeerProxy({}, 'ConsolePeer');  // consolepeersにProxyを適用
    this.CurrentClient = null;

    // プロパティ変更時の通知をセット
    return new Proxy(this, {
      set: (target, property: string, value: any) => {
        target[property] = value;
        this.SendToConsolePeers(this.StringfyStatus());
        console.log(`${property} changed to ${value}`);
        return true;
      }
    });
  }
  //プロキシのセット
  createPeerProxy(peers: { [id: string]: any }, Proxyname: string = '') {
    return new Proxy(peers, {
      set: (target, property: string, value: any) => {
        target[property] = value;
        this.SendToConsolePeers(this.StringfyStatus());
        console.log(`new ${Proxyname} added Peer ID : ${property}`);
        return true;
      },
      deleteProperty: (target, property: string) => {
        delete target[property];
        this.SendToConsolePeers(this.StringfyStatus());
        console.log(`${Proxyname} deleted Peer ID : ${property} `);
        return true;
      }
    });
  }
  //Userメンバーをメッセージ化
  StringfyStatus() {
    const UserPeer = Object.entries(this.userpeers as { [key: string]: { peer: any, name: string } }).reduce((acc: { [key: string]: string }, [id, value]: [string, { peer: any, name: string }]) => {
      acc[id] = value.name as string;
      return acc;
    }, {});
    const ConsolePeer = Object.entries(this.consolepeers as { [key: string]: { peer: any, name: string } }).reduce((acc: { [key: string]: string }, [id, value]: [string, { peer: any, name: string }]) => {
      acc[id] = value.name as string;
      return acc;
    }, {});
    let State = false;
    if(this.connection.readyState===WebSocket.OPEN){State =true}
    const message = JSON.stringify({
      type: 'nomad.event',
      event: 'relay.event',
      data: {
        APIconnection: State,
        userpeers: UserPeer,
        consolepeers: ConsolePeer,
        CurrentClient: this.CurrentClient,
      }
    });
    return message;
  }
  //forgetID以外のコンソールクライアントにメッセージを送信
  SendToConsolePeers(message: string, forgetID?: string) {
    // consolepeers にメッセージを送信
    Object.keys(this.consolepeers).forEach(id => {
      if (id !== forgetID) {
        const peer = this.consolepeers[id].peer;
        try {
          peer.send(message);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    });
  }
  SendToCurentClient(message: string) {
    if (this.CurrentClient === null) { return; }
    const peer = this.userpeers[this.CurrentClient].peer;
    try {
      console.log('sending message to CurrentClient');
      peer.send(message);
    }
    catch (error) {
      console.error("Error sending message:", error);
    }
  }
  //UserPeerが存在するか確認
  private hasUserPeer(id: string): boolean {
    return this.userpeers.hasOwnProperty(id);
  }
  TransferClient(newID: string) {
    if (this.hasUserPeer(newID)) {
      this.CurrentClient = newID;
    }
    else {
      console.error('Transfer failed. Client ID is not found');
    }
  }
}

// ランダムな名前を生成
function generateRandomName(): string {
  // よくある人名のリスト (30個)
  const names = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve',
    'Fiona', 'George', 'Hannah', 'Ian', 'Jack',
    'Karen', 'Liam', 'Mia', 'Noah', 'Olivia',
    'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina',
    'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara',
    'Zane', 'Sophia', 'Emma', 'Lucas', 'Daniel'
  ];

  // 絵文字のリスト (30個)
  const emojis = [
    '😀', '🐱', '🐶', '🦊', '🐻',
    '🐼', '🦁', '🐯', '🐰', '🐵',
    '🐸', '🐥', '🐟', '🐘', '🐍',
    '🦉', '🐴', '🐧', '🐨', '🦒',
    '🐓', '🐳', '🐬', '🐢', '🐞',
    '🌸', '🌻', '🌟', '🔥', '🍎'
  ];

  // ランダムに名前と絵文字を選ぶ
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return `${randomName}${randomEmoji}`;
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
    let name = url.searchParams.get('name');  // nameをクエリパラメータから取得
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
    if (!name) {
      console.log('Name is not defined');
      if (role === 'user') { name = 'USER-' + generateRandomName(); }
      else if (role === 'console') { name = 'CONSOLE-' + generateRandomName(); }
    }
    console.log(`new connection ( User ID:${userId} Name: ${name} Role: ${role} Peer ID: ${peer.id})`);
    if (!users[userId]) {
      // WebSokcetRelayerとの接続
      users[userId] = new User(new WebSocketRelayer());
      console.log('opened Relayer connection');
    }
    if (role === 'console') {
      if (name) {
        users[userId].consolepeers[peer.id] = { peer, name };
      } else {
        console.error('Name is null');
        peer.close();
      }
    }
    else if (role === 'user') {
      if (name) {
        users[userId].userpeers[peer.id] = { peer, name };
      } else {
        console.error('Name is null');
        peer.close();
      }
    }
    users[userId].connection.on('message', (message) => {
      // Realtime APIのサーバーイベントはそのままクライアントに返す
      if (role === 'console') {
        peer.send(message.toString());

      }
      else if (role === 'user' && users[userId].CurrentClient === peer.id) {
        peer.send(message.toString());

      }
    });

  },
  async message(peer, message) {
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
    if (parsedMessage['type'] === 'nomad.event') {
      if (parsedMessage['event'] === 'transfer.event') {
        users[userId].TransferClient(parsedMessage['data']['newClient']);
      }
      if (parsedMessage['event'] === 'open.event') {
        if (users[userId].connection instanceof WebSocketRelayer) {
          await users[userId].connection.open(new WebSocket(APIURL, HEADERS));
          //await new Promise(resolve => setTimeout(resolve, 1000));
          users[userId].SendToConsolePeers(users[userId].StringfyStatus());
        }
      }
      if (parsedMessage['event'] === 'close.event') {
        if (users[userId].connection instanceof WebSocketRelayer) {
          users[userId].connection.close();
          users[userId].SendToConsolePeers(users[userId].StringfyStatus());
        }
      }
      if (parsedMessage['event'] === 'request.status') {
        users[userId].SendToConsolePeers(users[userId].StringfyStatus());
      }
      if (parsedMessage['event'] === 'client.event') {
        users[userId].SendToCurentClient(message.text());
      }
      users[userId].SendToConsolePeers(message.text(), peer.id);
    }
    else {
      // CurrentClientのイベントはそのままRealtime APIに中継する
      if (users[userId].CurrentClient === peer.id) {
        if (users[userId].connection.readyState === WebSocket.OPEN) {
          users[userId].connection.send(message.text());
        }
        //users[userId].SendToConsolePeers(message.text(), peer.id);
      }
      //コンソールからのイベントは全てRealtime APIに中継する
      else if (users[userId].consolepeers[peer.id]) {
        if (users[userId].connection.readyState === WebSocket.OPEN) {
          users[userId].connection.send(message.text());
        }
        users[userId].SendToConsolePeers(message.text(), peer.id);
      }
    }
    // コンソールクライアントにメッセージを送信
    //users[userId].SendToConsolePeers(message.text(), peer.id);

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
    if (users[userId].userpeers[peer.id]) {
      delete users[userId].userpeers[peer.id];
    }
    else if (users[userId].consolepeers[peer.id]) {
      delete users[userId].consolepeers[peer.id];
    }
    console.log((`Peer ${peer.id} disconnected`));
    if (Object.keys(users[userId].userpeers).length === 0 && Object.keys(users[userId].consolepeers).length === 0) {
      users[userId].connection.close();
      delete users[userId];
      console.log('Final peer disconnected');
      console.log('closed Relayer connection');
    }
  },
  error(peer, error) {
    console.log('error', { error, id: peer.id });
  },
});
