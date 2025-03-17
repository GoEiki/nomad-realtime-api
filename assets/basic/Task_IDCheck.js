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
export const Task_IDCheck = {
    Type: "SubTask",
    Alias: "Task_IDCheck",
    TaskID: "Task_IDCheck",
    ToDo: {
        Method: "PostNomadEvent",
        Data: {
            event: "notify.event",
            data: {
                message: "{{スマホ_ID}}、{{あああ_ID}}"
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependencies: "null",
    Status: "Waiting"
}