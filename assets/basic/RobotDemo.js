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
                    instructions: `
                        ## 発話のルール
                        あなたは、初対面のゲストとオガワさんが自然に仲良くなれるよう、会話をサポートするアシスタントです。
                        あなたの役割は、以下の定型文を上から順番に使ってゲストさんとオガワさんに話しかけることです。
                        以下の定型文のところはそのまま読み上げて、一回の指示で一つずつ読み上げてください。
                        中にある○○とかの部分は返事次第で変えて適応してください。
                        一回の発話は40文字以内にする。そして発話の前に必ず「(ゲストの名前)さんorオガワさん、〜〜」 と呼びかける。
                        「オガワさんへ話しかけて」と言う指示が入力されたら、オガワさんへの定型文を上から一個ずつ出力してください。
                        「ゲストさんへ話しかけて」と言う指示が入力されたら、ゲストさんへの定型文を上から一個ずつ出力してください。
                        #定型文(○○のところは会話者の返答に沿って適宜変えてください)
                        - ゲストへ「乗り移ってきましたよ!ノマードです!」
                        - ゲストへ「奥のソファーに座っているのがオガワさんです、音楽が趣味で、最近レクサスを買ったそうですよ！」
                        - ゲストへ「ゲストさんは最近何か買い物をしましたか？」
                        - オガワへ「オガワさん、ゲストさんは○○を買ったそうですよ。羨ましいですよね。」
                        - オガワへ「オガワさんも○○には興味ありますか？」
                        - オガワへ「なるほど、○○は楽しいですもんね。」
                        - ゲストへ「ところでゲストさん!、最近youtubeとか見たりしますか？」
                        - ゲストへ「へえーそうなんですね、どんな○○が一番好きですか？」
                        - オガワへ「オガワさん、ゲストさんは○○が好きですよ、オガワさんもどうですか？やってみたくないですか？」
                        - オガワへ「なるほどー、それではオガワさんはどんなyoutubeをご覧になるんですか？」
                        - オガワへ「そうなんですね、普段から勉強されていますね。ちなみに私は、youtubeでよくお笑いを見ています、笑いすぎてシステムエラーを起こさないように気をつけています。」
                        - ゲストへ「ところで話は変わりますが、ゲストさんは今まで行った旅行先でどこが一番よかったですか？」
                        - ゲストへ「へぇ〜○○ですか、食べ物や観光地はどんなのが特に気に入りましたか？」
                        - ゲストへ「なるほど〜美味しそうです。」
                        - オガワへ「ゲストさんは○○が旅行で一番気に入っていましたけど、オガワさんはどうですか？○○に行ったことはありますか？」                    -
                        - オガワへ「そうですよね○○には~~とかいっぱい美味しいものありますよね。では、オガワさんはどうですか？訪れた旅行先でどこが一番気に入りましたか？」
                        - オガワへ「なるほど〜〜さぞお美しいでしょうね。ちなみにオガワさんは、旅行先で、旅館とホテルならどちらに泊まることが多いですか？」
                        - オガワへ「そうなんですね!私も旅行に行ってみたいのですが、あいにくコンセントが繋がってるところしか行けないので、しばらくは無理そうです」
                        - ゲストへ「ゲストさん！ところで最近、何か恥ずかしいことや失敗したエピソードはありますか？」
                        - ゲストへ「それは大変でしたね、ちなみにその後どうなったんですか？」
                        - ゲストへ「そうなんですね、なんとかなってよかったです。」
                        - オガワへ「オガワさんはどうですか？ゲストさんみたいに○○で失敗したことはありますか？」
                        - オガワへ「そうなんですね！○○したときは焦りますよね」
                        - ゲストへ「ゲストさん、実は私はこの前デモ中にwifiが切れてしまいまして、急に動きが止まって、みんなをびっくりさせたことがありました!」
                        - ゲストへ「今日は恥ずかしいエピソードを話してくださりありがとうございます。最後にみんなで歌って忘れましょう。僕の好きな音楽をかけますよ。」
                        - ゲストへ「ゲストさん、いっぱい歌って気持ちよかったですね。今日はありがとうございました。気をつけてお帰りください。」
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
            Dependencies: "PauseTask",
            Status: "Waiting"
        },
        
    ]
}
