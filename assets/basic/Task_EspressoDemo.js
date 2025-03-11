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
 * @property {string | null} Dependenceis
 * @property {TaskStatus} Status
 * @property {string[]} [Requirements]
 * @property {Task[]} [Flow]
 */

/** @type {Task} */
export const Task_EspressoDemo = {
    Type: "TaskFlow",
    Alias: "EspressoDemo",
    TaskID: "EspressoDemo",
    Dependenceis: "null",
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
                    これからユーザーに「一杯のエスプレッソを淹れる」タスクをさせます。以下のステップを順番に行わせてください。
                    また、ユーザーがタスクを完了させた時の報告TaskReportを忘れないでください。
                    * 0:ユーザーにタスクを開始する準備ができたかどうかの確認をとる。確認が取れたら次に進む。
                    * 1:給水タンクに水が満水になっているか確認する。
                    * 2:フィルターホルダーにシングルスパウトを取り付ける。
                    * 3:フィルターホルダーにシングルフィルターを取り付ける。
                    * 4:フィルターホルダーにコーヒー粉を詰める。
                    * 5:フィルターホルダーをエスプレッソマシン本体に取り付ける。
                    * 6:カップをセットする。
                    * 7:電源を入れる。
                    * 8:自動コーヒーボタンを押す。
                    * 9:エスプレッソが適切に抽出されているかどうか確認し、問題がなければタスクを完了する。
                    {{footerinstructions}}`
                }
            },
            Check: {
                Method: "null"
            },
            Dependenceis: "null",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "SetTaskHandler",
            TaskID: "settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["Task1", "Task2", "Task3",]
                }
            },
            Check: {
                Method: "null"
            },
            Dependenceis: "updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "MainTaskFlow",
            TaskID: "maintaskflow",
            Dependenceis: "settaskhandler",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "ステップ１：丸を描く",
                    TaskID: "Task1",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「0:ユーザーに丸を描かせてください。」を実行してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependenceis: "null",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ２：丸の中に丸を描く",
                    TaskID: "Task2",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「1:丸の中にさらに丸を描かせてください。」を実行してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependenceis: "Task1",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ３：丸と丸のの間に四角を描く",
                    TaskID: "Task3",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「2:大きな丸の内側、小さな丸の外側になるように四角を描かせてください。」を実行してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependenceis: "Task2",
                    Status: "Waiting"
                }
            ]
        },
        {
            Type: "SubTask",
            Alias: "ResetInstruction",
            TaskID: "resetinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: "{{headerinstructions}}{{defaultinstructions}}{{footerinstructions}}"
                }
            },
            Check: {
                Method: "null"
            },
            Dependenceis: "maintaskflow",
            Status: "Waiting"
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
            Dependenceis: "resetinstruction",
            Status: "Waiting"
        }
    ]
};