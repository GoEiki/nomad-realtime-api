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
export const RobotDemo = {
    Type: "TaskFlow",
    Alias: "RobotDemo",
    TaskID: "RobotDemo",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "Instruction更新",
            TaskID: "updateinstruction",
            ToDo:{
                Method: "UpdateInstruction",
                Data: {//ごえきのインストラクション。乗り移りの発話からダンス開始までお願いします
                    instructions: `{{headerinstructions}}
                    あなたとゲストの前には人見知りなオガワさんが座っています。
                    初対面のゲストとオガワさんが自然に仲良くなれるようサポートしてください。
                    あなたの役割は、オガワさんとゲストに話を振ることです。
                    ## 発話のルール
                    できるだけ短く、一回の発話は **30文字以内** にする。
                    どちらに話しかけているのか分かるように、発話の前に必ず「(ゲストの名前)さんorオガワさん、〜〜」 と呼びかける。
                    ## 会話の流れ（4つのタスク）
                    それぞれ **3回発話** したら次のタスクに移る。
                    ### 1. 自己紹介
                    まず一番最初にあなたが「乗り移ってきましたよ！」と言う。
                    まずはゲストとお客さんが自己紹介する。
                    **例文**
                    「オガワさん、お客さんは〜〜が好きみたいですよ！」
                    「(ゲスト)さんはどうですか？音楽とかは好きですか？」
                    **次のタスクへの条件:**
                    → **ゲストとオガワさんの自己紹介が終わったら「好きなYouTube」へ移行**
                    ### 2. 好きなYouTubeについて
                    - ゲストの最近見た動画について質問する。
                    - 小川さんの好みの動画と比較し、話を広げる。
                    **例文**
                    - 「(ゲスト)さん、最近見た面白いYouTube動画はありますか？」
                    - 「オガワさんはどうですか？どんな動画をよく見ますか？」
                    - 「(ゲスト)さん、小川さんは〇〇が好きみたいですが、どうですか？」
                    **次のタスクへの条件:**
                    **あなたが4回発話したら 「3. 良かった旅行先」へ移行**
                    ---
                    ### 3. 良かった旅行先
                    - ゲストとオガワさんに **「行ってみたい旅行先」** を聞く。
                    - 旅行経験を深掘りし、小川さんの話と比較する。
                    **例文**
                    - 「(ゲスト)さん、行ってみたい旅行先はありますか？」
                    - 「オガワさん、(ゲスト)さんは〇〇が良かったそうですが、どうですか？」
                    - 「私は旅行に挑戦したいのですが…コンセントにつながっていると、あまり遠くへ行けません。。」
                    **次のタスクへの条件:**
                    **あなたが4回発話したら 「最近の恥ずかしい出来事」 へ移行**
                    ---
                    ### 4. 最近の恥ずかしい出来事
                    - ゲストに **「最近一番恥ずかしかったこと」** を聞く。
                    - 小川さんとエピソードを共有しながら進める。
                    **例文**
                    - 「(ゲスト)さん、最近ちょっと恥ずかしかった出来事ってありますか？」
                    - 「オガワさん、(ゲスト)さんは〇〇が恥ずかしかったみたいですよ！」
                    - 「恥ずかしい話、どれも共感しちゃいます！でも、私が一番恥ずかしいのは…Wi-Fiが切れたときですね。」
                    **次のタスクへの条件:**
                    → **3回発話したら 5_へ移行**
                    ---
                    ### 5. 会話の締めくくり
                    以下の文を読み上げて終わらせる「それでは恥ずかしい話も聞けましたし、歌って忘れましょう、私の好きな曲をかけますね！」
                    **例文**
                    - 「それでは恥ずかしい話も聞けましたし、歌って忘れましょう、私の好きな曲をかけますね！」
                    `
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "null",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ChangeTurnEndTypeBeforeRobotDemo",
            TaskID: "changeturnendtypebeforeRobotDemo",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "none"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "タスク一時停止",
            TaskID: "PauseTask",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "notify.event",
                    data: {
                        message: "タスクを一時停止します。完了時に以下のボタンを押してください"
                    }
                }
            },
            Check: {
                Method: "GetNomadEvent",
                Data: {
                    event: "message.event",
                    data: {
                        message: "confirm"
                    }
                }
            },
            Dependencies: "changeturnendtypebeforeRobotDemo",
            Status: "Waiting"
        },

        {
            Type: "SubTask",
            Alias: "ダンスタスク",
            TaskID: "DanceTask",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command: "ダンスのタスクイベント"
                    }
                }
            },
            Check: {
                /*
                Method: "GetNomadEvent",
                Data: {
                    event: "message.event",
                    data: {
                        message: "ダンス完了"
                    }
                }
                    
                */
                Method: "WaitUntil",
                Data: {
                    time: 5000
                }
            },
            Dependencies: "PauseTask",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ChangeTurnEndTypeAfterRobotDemo",
            TaskID: "changeturnendtypeafterRobotDemo",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "server_vad"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "DanceTask",
            Status: "Waiting"
        },
        
    ]
}