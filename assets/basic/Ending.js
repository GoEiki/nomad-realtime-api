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
export const Ending = {
    Type: "TaskFlow",
    Alias: "エンディング",
    TaskID: "Ending",
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
                    これですべてのデモンストレーションが終了しました。お疲れ様でした。
                    ゲストに感謝の気持ちを伝え、デモンストレーションを終了してください。
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
            Alias: "デモ終了",
            TaskID: "EndDemo",
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
                        message: "タスクを一時停止します。下のボタンを押すとすべてのデモンストレーションが終了します。"
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
            Dependencies: "EndDemo",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ChangeTurnEndTypeAfterDemo",
            TaskID: "changeturnendtypeafterDemo",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "none"
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