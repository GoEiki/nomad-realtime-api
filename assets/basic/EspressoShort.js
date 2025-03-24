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
                    これからゲストの方に「一杯のエスプレッソを淹れる」タスクに取り組んでいただきます。
                    以下がこのタスクのゴールドスタンダードになります。順番を守ってステップバイステップで進めてください。
                    また、ゲストの方がタスクを完了された際にはFunction Callingで報告をお願いいたします。
                    * 0:ゲストの方にタスクを開始する準備ができたかどうかの確認を取ってください。確認が取れたらFunction Calling(0)を行ってください。
                    * 1:フィルターホルダーにコーヒー粉を詰めてください。（量は計量スプーンに山盛り一杯です）確認が取れたらFunction Calling(1)を行ってください。
                    * 2:フィルターホルダーをエスプレッソマシン本体に取り付けてください。確認が取れたらFunction Calling(2)を行ってください。
                    * 3:カップをセットしてください。確認が取れたらFunction Calling(3)を行ってください。
                    * 4:電源を入れてください。確認が取れたらFunction Calling(4)を行ってください。
                    * 5:自動コーヒーボタンを押してください。（自動コーヒーボタンは電源ボタンの隣です）確認が取れたらFunction Calling(5)を行ってください。
                    * 6:エスプレッソが適切に抽出されているかどうか確認し、問題がなければタスクを完了してください。確認が取れたらFunction Calling(6)を行ってください。
                    * 7:次のタスクへ移行してください。移行するためにはFunction Calling(7)を行ってください。
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
                    Target: ["Task0", "Task1", "Task2","Task3", "Task4", "Task5","Task6","Task7"]
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
                    Alias: "ステップ１：ユーザーの確認",
                    TaskID: "Task0",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ゲストの方にタスクを開始する準備ができたかどうかの確認を取ってください。"
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
                    Alias: "ステップ2：コーヒー粉を詰める",
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
                    Alias: "ステップ3：本体に取り付ける",
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
                    Alias: "ステップ4：カップをセットする",
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
                    Alias: "ステップ5：電源を入れる",
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
                    Alias: "ステップ6：自動コーヒーボタンを押す",
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
                    Alias: "ステップ7：抽出を確認する",
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
                    Alias: "ステップ7：次のタスクへ進む",
                    TaskID: "Task7",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task6",
                    Status: "Waiting"
                }
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
        }
    ]
};