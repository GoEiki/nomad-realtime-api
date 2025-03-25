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
export const TransferToEarbuds = {
    Type: "TaskFlow",
    Alias: "イヤホンへ乗り移り",
    TaskID: "TransferToEarbuds",
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
この部屋には、エスプレッソマシンがあります。このエスプレッソマシンを使ってゲストにエスプレッソを淹れるタスクに取り組んでいただきます。
しかし、現在はテレビに乗り移っている状態のため、この状態ではエスプレッソの淹れ方をお伝えすることができません。そのため、これからイヤホンに乗り移ります。
イヤホンに乗り移るため、以下の目的を達成するように会話を進めてください。
また、目的を達成した際にはFunction Callingを忘れないでください。
0: ゲストの方にエスプレッソをお勧めし、 タスクをサポートするためにイヤホンに乗り移る必要があることを伝え、Function Calling(0)を行ってください。
1: ゲストにイヤホンをつけてもらい、つけたことが確認できたらFunction Calling(1)を行ってください。
2: 乗り移りが完了したことをお伝えし、これからタスクをサポートことを伝え、Function Calling(2)を行ってください。
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
            Alias: "エスプレッソを勧める",
            TaskID: "Recommend",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "ゲストの方にエスプレッソをお勧めし、 タスクをサポートするためにイヤホンに乗り移る必要があることを伝え、Function Calling(0)を行ってください。"
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
            Alias: "イヤホンへ乗り移り",
            TaskID: "MigrateToEarbuzz",
            ToDo: {
                Method: "Replace",
                Data: {
                    Target: "MigrateToEarbuzz",
                    Task: "BaseMigration",
                    ReplaceData: {
                        newDeviceName: "イヤーバズ",
                        newClientID: "{{イヤーバズ_ID}}"
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
                        instructions: "乗り移りが完了したことをお伝えし、これからタスクをサポートすることを伝え、Function Calling(2)を行ってください。"
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
        }


    ]
}