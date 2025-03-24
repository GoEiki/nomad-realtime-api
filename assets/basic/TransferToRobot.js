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
export const TransferToRobot = {
    Type: "TaskFlow",
    Alias: "ロボットへ乗り移り",
    TaskID: "TransferToRobot",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "Instruction更新",
            TaskID: "updateinstruction",
            ToDo:{
                Method: "UpdateInstruction",
                Data: {
                    instructions: `{{headerinstructions}}
                    次のタスクです。
これからゲストとソファで会話を楽しむため、テーブル上のロボットに乗り移ります。
ロボットに乗り移るため、以下の目的を達成するように順番に会話を進めてください。
0: ゲストの方にソファでくつろぐことをお勧めしてください。そして、テーブル上のロボットに乗り移る必要があることを伝え、Function Calling(0)を行ってください。
1: ゲストの発話を待ってFunction Calling(1)を行ってください。
2: 乗り移りが完了したことを伝え、Functin Calling(2)を行ってください。
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
            Alias: "TaskHandlerに登録",
            TaskID: "settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["Recommend","Confirm","Explain"],
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
            Alias: "ソファでくつろぐことを勧める",
            TaskID: "Recommend",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "ゲストの方にソファでくつろぐことをお勧めしてください。そして、テーブル上のロボットに乗り移る必要があることを伝え、Function Calling(0)を行ってください。"
                    }
                }
            },
            Check: {
                Method: "Wait"
            },
            Dependencies: "updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "乗り移り確認",
            TaskID: "Confirm",
            ToDo:{
                Method: "null",
            },
            Check: {
                Method: "Wait"
            },
            Dependencies: "Recommend",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ロボットへ乗り移り",
            TaskID: "MigrateToEarbuzz",
            ToDo: {
                Method: "Replace",
                Data: {
                    Target: "MigrateToEarbuzz",
                    Task: "BaseMigration",
                    ReplaceData: {
                        newDeviceName: "ロボット",
                        newClientID: "{{ロボット_ID}}"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "Confirm",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "乗り移ったよ",
            TaskID: "Explain",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "乗り移りが完了したことを伝え、Functin Calling(2)を行ってください。"
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
            Alias: "ResetTaskHandler",
            TaskID: "resettaskhandler",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "Explain",
            Status: "Waiting"
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
            Dependencies: "resettaskhandler",
            Status: "Waiting"
        },

    ]
}