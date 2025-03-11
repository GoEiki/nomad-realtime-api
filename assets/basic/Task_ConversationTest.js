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
export const Task_ConversationTest = {
    Type: "TaskFlow",
    Alias: "ConversationTest（丸を描くタスク）",
    TaskID: "ConversationTest",
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
                    これからユーザーに簡単なタスクをさせます。以下のタスクを順番に行わせてください。
                    また、ユーザーがタスクを完了させた時の報告TaskReportを忘れないでください。¥n
                    * 0:ユーザーに丸を描かせてください。<br>
                    * 1:丸の中にさらに丸を描かせてください。<br>
                    * 2:大きな丸の内側、小さな丸の外側になるように四角を描かせてください。<br>
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
                    Target: ["Task1", "Task2", "Task3"]
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