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
                    あなたの次のタスクはゲストとオガワさんの会話を取り持つことです。
                    同時に二人の人と会話をするので、できるだけ誰に向かって話しているか分かりやすい形で返してください。
                    これから二人それぞれへの会話の指示を送るので従って定型文を一つずつ出力してください。
                    できるだけ誰に話しているのか分かりやすく答えてください。
                    一回の発話は40文字以内にする。
                    `
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "null",
            Status: "Waiting"
        },

        
    ]
}
