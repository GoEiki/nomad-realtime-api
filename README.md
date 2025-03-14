# NOMADシステム
## インストール方法
### プログラムのインストール
```
git clone https://github.com/tamiyaayumu/nomad-realtime-api
```
### ~~自己署名証明書の発行~~
1. ~~秘密鍵の生成~~
```
openssl genrsa 2048 > nomad.key
```
2. ~~自己署名証明書の発行~~
```
openssl req -new -x509 -days 3650 -key nomad.key -sha512 -out nomad.crt
```
### OpenAIのAPIキー
環境変数としてOPENAI_API_KEYを設定する  
**zshの場合**  
yourkeyを自分のAPIキーに置き換える  
```
echo "export OPENAI_API_KEY='yourkey'" >> ~/.zshrc
```
シェルを更新する
```
source ~/.zshrc
```
### 設定ファイルへの書き込み
~~package.jsonの下記部分に証明書と秘密鍵のパスを記載~~
```
"scripts": {
"ssl": "nuxt dev --https --ssl-cert <enter cerfiticate file path> --ssl-key <enter key path> --host 0.0.0.0 --port 3000",
}
```

nuxt.config.tsの下記部分にIPアドレスを記載
```
runtimeConfig: {
    public: {
      DefaultIPAdress: '10.0.1.56:3000',
      DefaultUserID: 'user123',
    },
}
```
※ローカルネットワーク内のみ動作

## 依存関係のインストール
```
npm install
```
## 実行
```
npm run ssl
```
表示されたURLをブラウザで開く

# タスクフロー
## 0. はじめに
### ファイル作成
- assets/basicに以下の形式のファイルを作成するとStateManagerにタスクを設定することができる。
- ファイルは.json .jsに対応しているが、改行&コメントアウト&型チェックができる .jsがおすすめ。
- タスクの識別は後述のTaskIDで行うためファイル名やオブジェクト名に特に指定はない。
### 実行手順
- https://ipadress:port/ConsoleUI にアクセス
- Console、Controls、StateManager、TaskFlow、各種ログウィンドウがある
    - Consoles：主にサーバー・デバイスの接続関連
    - Controls：StateManagerに関係なくRealTimeAPIに指示を送信する
    - StateManager：タスクのキューイング、パラメータの確認
    - TaskFlow：タスクキューを確認
- https://ipadress:port/StateManager にアクセス
    - このページがStateManagerのオブジェクト
- Console、StateManagerを接続する
- StateManagerウィンドウの↺ボタンを押すと登録されているタスクのリストが読み込まれる
    - サーバーを再起動しなくても編集可
- セレクターから選択して送信するとタスクが実行される。
    - 音声対話でデバッグする場合https://ipadress:port/ClientUI にアクセスし接続する
    - テキスト対話でデバッグする場合Controlsで'As User'を選択することでユーザーとして対話できる
### その他注意点
- 
## 1. Task Interface
```
interface Task {
    Hidden?: boolean;
    Alias?: string;
    Type: 'TaskFlow' | 'SubTask';
    TaskID: string;
    ToDo?: ToDo
    Check?: ToDo;
    Dependencies: string;
    Status: 'Waiting' | 'Completed';
    Requirements?: string[];
    Flow?: Task[];
}
```
### Type
```
Type:Type: 'TaskFlow' | 'SubTask';
```
SubTaskは実際に行われる関数を記述、TaskFlowは複数のSubTaskやTaskFlowをネスト構造でまとめる。必須
### TaskID
```
TaskID: string;
```
タスクを識別するためのID。キューイング時にUUIDに置換される。同一タスク内で被らないこと。必須
### ToDo,Check
```
interface ToDo {
    Method: string;
    Data?: any;
}
```
実際に行われる関数を記述する。Methodに実行したい関数。Dataは引数。（TaskExample.jsを参照）
ToDoは即時実行される関数、Checkは特定の動作を待つ関数を実装する。
SubTaskの場合は両方必須だが、"null"をメソッドに指定することでスキップできる。
### Dependencies
```
Dependencies: string;
```
依存するTaskIDを記述。ない場合は"null"。必須
### そのほか
```
Hidden?: boolean; //表示したくない場合はtrue
Alias?: string; //表示上の名前
Status: 'Waiting' | 'Completed'; //タスクの状態。必須
Requirements?: string[]; //必要な引数を定義
Flow?: Task[]; //TaskFlowの場合この中にネストする。TaskFlowの場合は必須
```
## 2. 基本的な作り方
### 型チェックを追加(.jsのみ)
```
// @ts-check

/**
 * @typedef {'TaskFlow' | 'SubTask'} TaskType
 * @typedef {'Waiting' | 'Completed'} TaskStatus
 */

/**
 * @typedef {Object} ToDo
 * @property {string} Method
 * @property {any} [Data]
 */

/**
 * @typedef {Object} Task
 * @property {boolean} [Hidden]
 * @property {string} [Alias]
 * @property {TaskType} Type
 * @property {string} TaskID
 * @property {ToDo} [ToDo]
 * @property {ToDo} [Check]
 * @property {string | null} Dependencies
 * @property {TaskStatus} Status
 * @property {string[]} [Requirements]
 * @property {Task[]} [Flow]
 */

/** @type {Task} */
```
型のチェックを自動で行ってくれるため、まずこれを追加し以下にTaskを作成する。
### TaskFlowを追加
```
export const Task_MessageTest = {
    Type: "TaskFlow",
    Alias: "SimpleExample",
    TaskID: "SimpleExample",
    Dependencies: "null",
    Status: "Waiting",
    Flow: []
};
```
必須の情報を追加する。
### SubTaskを追加
```
export const Task_MessageTest = {
    Type: "TaskFlow",
    Alias: "SimpleExample",
    TaskID: "SimpleExample",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "SimpleTask1",
            TaskID: "Task_PostMessage_Example",//被りにくいIDを設定
            ToDo: {
                Method: "PostNomadEvent",//NomadEventを送信。（RealTimeAPIには送信されないイベント）
                Data: {
                    event: "notify.event",//Event名。（コンソールに通知する）
                    data: {
                        message: "Hello World"//表示メッセージ
                    }
                }
            },
            Check: {
                Method: "GetNomadEvent",//特定のNomadEventを受け取るまで待機。
                Data: {
                    event: "message.event",//Event名
                    data: {
                        message: "confirm"//待機メッセージ（コンソール画面で確認を押すと送信される）
                    }
                }
            },
            Dependencies: "null",//依存タスクなし
            Status: "Waiting"
        }
    ]
};
```
Flowの中にSubTaskを作成する。以後同様にTaskFlow、SubTaskを追加する。

## 3. そのほか
### Replace
すでに作成したTaskFlowを使いまわしたい時に、Replaceメソッドにより置換できる
```
{
    Type: "SubTask",
    TaskID: "Task_Replace_Example",//被りにくいIDを設定
    ToDo: {
        Method: "Replace",//Replaceメソッドを指定
        Data: {
            Target: "Task_Replace_Example",//必ず自分自身を指定
            Task: "ReplaceTask",//置換したいタスクのIDを指定。assets/basicに作成されているファイルのみ
            ReplaceData: {
                message: "Replace Succeeded"//置換先の引数
            }
        }
    },
    Check: {
        Method: "null"//チェックは必要なし
    },
    Dependencies: "null",
    Status: "Waiting"
}
```
置換先のタスク
assets/basicに作成したファイルのみ
```
{
    "Hidden": true,//画面には表示しない。
    "Type": "SubTask",
    "TaskID": "ReplaceTest",//置換したいタスクのID
    "Requirements": [
        "message"//引数を指定
    ],
    "ToDo": {
        "Method": "PostNomadEvent",
        "Data": {
            "event": "notify.event",
            "data": {
                "message": "{{message}}"//引数は{{}}を用いて置換する
            }
        }
    },
    "Check": {
        "Method": "GetNomadEvent",
        "Data": {
            "event": "message.event",
            "data": {
                "message": "confirm"
            }
        }
    },
    "Dependencies": "null",
    "Status": "Waiting"
}
```

### TaskQueue
実行キューにタスクを追加。基本的な使い方はReplaceと同じ
```
    Type: "SubTask",
    TaskID: "Task_Queueing_Example",//被りにくいIDを設定
    ToDo: {
        Method: "TaskQueue",//TaskQueueメソッドを指定
        Data: {
            Task: "SomeTask",//追加したいタスクのIDを指定。assets/basic内に作成されているファイルのみ
            ReplaceData: {
                message: "Queue Succeeded"//置換先の引数
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependencies: "null",
    Status: "Waiting"
```

### DefaultConfig
キューイング時に自動置換される文字列を定義
```
"Data": {
    "headerinstructions": "",
    "footerinstructions": "",
    "defaultinstructions": "現在、タスクは与えられていません。自由にユーザーを楽しませてください。",
    "turn_detection": "server_vad",
    "voice": "coral"
}
```

### Init.json
セッションの初期化。RealTimeAPIが発話を開始する前に実行する。
（発話後はVoiceの変更ができないためエラーが出る）