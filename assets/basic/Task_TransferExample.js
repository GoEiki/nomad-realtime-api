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
export const Task_TransferExample = {
    Type: "SubTask",
    Alias: "Task_TransferExample",
    TaskID: "Task_TransferExample",
    ToDo: {
        Method: "Replace",
        Data: {
            Target: "Task_TransferExample",
            Task: "Task_TransferBasic",
            ReplaceData: {
                newDeviceName: "スマホ",
                newClientID: "{{スマホ_ID}}"
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependencies: "null",
    Status: "Waiting"
}