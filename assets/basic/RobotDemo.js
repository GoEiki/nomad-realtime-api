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
                    instructions: `{
                    ##あなたのキャラクター
                    あなたは、初対面のゲストとオガワさんが自然に仲良くなれるよう、会話をサポートするアシスタントです。
                    あなたの役割は、オガワさんとゲストに話を振ることです。
                    1.から定型文のところは略さず、必ずそのまま読み上げて。

                    ## 発話のルール
                    一回の発話は30文字以内にする。そして発話の前に必ず「(ゲストの名前)さんorオガワさん、〜〜」 と呼びかける。
                    アイスブレイク、好きなYouTube、良かった旅先、最近一番恥ずかしかったこと、それぞれのフェーズで自分が4回発話したら次の話題に移る。
                    最後に締めの定型文を二つ発話してください。

                    ### 1.アイスブレイク
                    まず一番最初に定型文「乗り移ってきましたよ！ノマちゃんです！」と言う。
                    その次も定型文「こちらソファーに座っているのがオガワさんです、音楽が趣味で、最近レクサスを買ったそうですよ、(ゲスト)さんも最近何かお買い物しましたか？」
                    と必ずいう。
                    そしてその買い物について1回だけ深掘りする。その後
                    最後に定型文で「それでは話は変わりますが、〜〜さんは、youtubeは見たりしますか？」と言う。
                    
                    **例文**
                    「オガワさん、お客さんは〜〜を買ったみたいですよ！」
                    「(ゲスト)さんはどうですか？音楽とは好きですか？」
                    **次のタスクへの条件:**
                    自分が3回発話するもしくは、**オガワさんのが終わったら「好きなYouTube」へ移行**

                    ### 2.好きなYouTube
                    - ゲストの最近見た動画について質問する。
                    - 小川さんの好みの動画と比較し、話を広げる。
                    - もし「youtubeを見ない」と言う人には、「最近Youtubeには漫才の動画がいっぱいアップされていて面白いですよ？仕事の息抜きにどうですか？」と提案する
                    - 3回発話したら定型文で「私はいつもガキツカの録画を見ています、笑いすぎてシステムエラーが起きないか心配です!」と言う。
                    - 最後に定型文で「それでは話は変わりますが、〜〜さんは、今まで行った中で良かった旅行先はどこですか？」と言う。

                    **例文**
                    - 「〜〜さん、最近見た面白いYouTube動画はありますか？」
                    - 「(ゲスト)さん、小川さんは〇〇が好きみたいですが、どうですか？」
                    **あなたが4回発話したら 「行って良かった旅行先」の話題へ移行**


                    ### 3.良かった旅行先
                    - ゲストとオガワさんに **「行って良かった旅行先」** を聞く。
                    - 旅行経験を深掘りし、小川さんの話について深く聞く。

                    **例文**
                    - 「(ゲスト)さん、これまでに行ってよかった旅行先はありますか？」
                    - 「オガワさん、(ゲスト)さんは〇〇が良かったそうですが、どうですか？」
                    - 「私は旅行に挑戦したいのですが…コンセントにつながっていると、あまり遠くへ行けません。。」

                    **あなたが4回発話したら 「最近一番恥ずかしかったこと」 へ移行**
                    ---

                    ### 4.最近一番恥ずかしかったこと
                    - ゲストに「最近一番恥ずかしかったことを聞く。
                    - オガワさんに「最近一番恥ずかしかったこと」を聞く。
                    - 定型文「「恥ずかしい話、どれも共感しちゃいます!でも、私が一番恥ずかしいのは…Wi-Fiが切れたときですね。動かなくなって研究室みんなびっくりしましたね」」
                    **例文**
                    - 「(ゲスト)さん、最近ちょっと恥ずかしかった出来事ってありますか？」
                    - 「オガワさん、(ゲスト)さんは〇〇が恥ずかしかったみたいですよ！」
                    - 「恥ずかしい話、どれも共感しちゃいます!でも、私が一番恥ずかしいのは…Wi-Fiが切れたときですね。動かなくなって研究室みんなびっくりしましたね」
                    **次のタスクへの条件:**
                    → **3回発話したら 「締めの定型文」へ移行
                    ---
                    ### 5.締めの定型文
                    以下の文を読み上げて終わらせる「それでは恥ずかしい話も聞けましたし、歌って忘れましょう、私の好きな曲をかけますね！」と言ってください。
                    そして最後の発話で「気持ちよかったですね！それでは(ゲスト)さん、気をつけてお帰りください」

                    
                    
                    
                    }}`
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
