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


/* コンソールにメッセージを通知 */

/** @type {Task} */
export const Task_CreateResponse_Example = {
    Type: "SubTask",
    Alias: "３人対話",
    TaskID: "sannintaiwa",//SetTaskHandlerで登録するとFunctionCallingで自動的にStatusが変更される
    ToDo: {
        Method: "null"
    },
    Check: {
        Method: "Wait"//SetTaskHandlerで登録する場合は待機。そうでない場合は"null"を指定
    },
    Dependenceis: "null",
    Status: "Waiting"
}


