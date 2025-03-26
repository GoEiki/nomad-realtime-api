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
export const ReplaceMigration = {
    Type: "SubTask",
    TaskID: "ReplaceMigration",//被りにくいIDを設定
    Alias: "Migration",//タスクの名前
    ToDo: {
        Method: "Replace",//Replaceメソッドを指定
        Data: {
            Target: "ReplaceMigration",//必ず自分自身を指定
            Task: "BaseMigration",//置換したいタスクのIDを指定。assets/basic内に作成されているファイルのみ
            ReplaceData: {
                newDeviceName: "{{newDeviceName}}",
                newClientID: "{{newClientID}}"
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependencies: "null",
    Status: "Waiting"
}