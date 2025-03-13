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
export const Task_ClientTest = {
    Type: "TaskFlow",
    Alias: "ClientTest",
    TaskID: "Task_ClientTest",
    Dependenceis: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "Message1",
            TaskID: "T1",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        message: "Message1 Sended"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependenceis: "null",
            Status: "Waiting"
        }   
    ]
};