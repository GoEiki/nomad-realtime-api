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
export const EspressoShort = {
    Type: "TaskFlow",
    Alias: "EspressoShort",
    TaskID: "EspressoShort",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "UpdateInstruction",
            TaskID: "updateinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: `{{headerinstructions}}
                    あなたは、今イヤホンに乗り移ってきました。
                    これからゲストの方に「一杯のエスプレッソを淹れる」タスクに取り組んでいただきます。
                    その後、ゲストにはソファに座ってもらい、あなたはテーブル上のロボットに乗り移ります。
                    以下がこのタスクのゴールドスタンダードになります。順番を守ってステップバイステップで進めてください。
                    基本的に例示の文に従って発話してください。
                    * 0:イヤホンに乗り移ってきたことを伝え、音声のやり取りができるか確認してください。確認が取れたらFunction Calling(0)を行ってください。
                     例「イヤホンに乗り移りました。聞こえていますか？」
                    * 1:ゲストにエスプレッソマシンの前までくるように誘導してください。確認が取れたらFunction Calling(1)を行ってください。
                     例「エスプレッソマシンの前に来てください。」
                    * 2:ゲストに注意事項を説明し、タスクを開始する準備ができたかどうかの確認を取ってください。確認が取れたらFunction Calling(2)を行ってください。
                     例「本体が高温になるため触れる際は注意し、また、取り外し可能な部品の縁や高温の蒸気でのやけどや怪我にも十分気をつけてください。」
                     例「それでは、今からエスプレッソを淹れていただきます。準備はいいですか？」
                    * 3:フィルターホルダーにコーヒー粉を量り入れ、タンパーで軽く押し詰める。（フィルターホルダーは黒い持ち手のある、金属製のフィルターがついた部品です。）（量は計量スプーンに山盛り一杯です。タンパーを使って軽く押し詰める必要があります。）確認が取れたらFunction Calling(3)を行ってください。
                     例「まず初めに、手元にあるフィルターホルダーにコーヒー粉を入れてください。」
                    * 4:フィルターホルダーをエスプレッソマシン本体に取り付けてください。（三角の印とフィルターホルダーの持ち手を合わせ、本体下部の挿入口に入れ、止まるまで右に回す）確認が取れたらFunction Calling(4)を行ってください。
                     例「フィルターホルダーをエスプレッソマシン本体に取り付けてください」
                    * 5:カップをセットしてください。確認が取れたらFunction Calling(5)を行ってください。
                     例「お手元の紙コップを抽出口にセットしてください」
                    * 6:電源を入れてください。（電源は本体正面一番左のボタンです）（湯が温まるまで時間がかかるので、ボタンが点灯するまで待ってください）確認が取れたらFunction Calling(6)を行ってください。
                     例「電源スイッチを押してください。なお湯が温まるまで時間がかかるので、ボタンが点灯するまで待ってください。点灯したら教えてください」
                    * 7:自動コーヒーボタンを押してください。（自動コーヒーボタンは電源ボタンの隣です）確認が取れたらFunction Calling(7)を行ってください。
                     例「自動コーヒーボタンを押し抽出を開始してください。」
                    * 8:エスプレッソが適切に抽出されているかどうか確認し、問題がなければタスクを完了してください。確認が取れたらFunction Calling(8)を行ってください。
                     例「抽出できていますか？抽出が終了したらお知らせください。」
                    * 9:次にソファでくつろぐことを勧め、あなたはロボットへ乗り移ることを伝えてください。乗り移るためにFunction Calling(9)を行ってください。
                     「ぜひソファでくつろいでください。私はテーブル上のロボットへ乗り移ります。」
                    {{footerinstructions}}`
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
            Alias: "ResetTaskHandlerBeforeTask",
            TaskID: "resettaskhandlerbeforetask",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "null",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "SetTaskHandler",
            TaskID: "settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["Task0", "Task1", "Task2","Task3", "Task4", "Task5","Task6","Task7","Task8","Task9"]
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "resettaskhandlerbeforetask",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "MainTaskFlow",
            TaskID: "maintaskflow",
            Dependencies: "settaskhandler",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "ステップ１：乗り移りの確認",
                    TaskID: "Task0",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "イヤホンに乗り移ってきたことを伝え、音声のやり取りができるか確認してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "null",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ2：エスプレッソマシンの前まで誘導",
                    TaskID: "Task1",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task0",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ3：ユーザーの確認",
                    TaskID: "Task2",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task1",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ4：コーヒー粉を詰める",
                    TaskID: "Task3",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task2",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ5：本体に取り付ける",
                    TaskID: "Task4",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task3",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ6：カップをセットする",
                    TaskID: "Task5",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task4",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ7：電源を入れる",
                    TaskID: "Task6",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task5",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ7：自動コーヒーボタンを押す",
                    TaskID: "Task7",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task6",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ8：抽出を確認する",
                    TaskID: "Task8",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task7",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ9：ソファでくつろぐことを勧める",
                    TaskID: "Task9",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task8",
                    Status: "Waiting"
                },

            ]
        },
        {
            Type: "SubTask",
            Alias: "ResetTaskHandler",
            TaskID: "resettaskhandler",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "maintaskflow",
            Status: "Waiting"
        },

    ]
};