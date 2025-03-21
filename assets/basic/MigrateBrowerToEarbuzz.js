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
export const MigrateBrowserToEarbuzz = {
    Type: "TaskFlow",
    Alias: "ブラウザからイヤーバズへ",
    TaskID: "MigrateBrowserToEarbuzz",
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
                    あなたは画面上のCGアバターです。
                    あなたはこれから、イヤホンへ乗り移り、音声アシスタントとなり、ユーザにエスプレッソを勧めてください。
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
            Alias: "エスプレッソマシンを勧める",
            TaskID: "RecommendEspresso",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "ユーザにエスプレッソマシンを使ってエスプレッソを淹れるように勧めてください。"
                    }
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
            Alias: "イヤーバズへ乗り移り",
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
            Dependencies: "null",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "乗り移ったよ",
            TaskID: "ExplainMigration",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "ユーザに、イヤホンへ乗り移ってきたことを伝え、エスプレッソマシンを使ってエスプレッソを淹れるように勧めてください。"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "MigrateToEarbuzz",
            Status: "Waiting"
        },
    ]
}