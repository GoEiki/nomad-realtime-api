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
export const NomadTasks = {
    Type: "TaskFlow",
    Alias: "Nomad Tasks",
    TaskID: "NomadTasks",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "Add Introduction",
            TaskID: "TaskQueue1",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"introduction",
                    ReplaceData: {}
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
            Alias: "Add TransferToEarbuzz",
            TaskID: "TaskQueue2",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"MigrateBrowserToEarbuzz",
                    ReplaceData: {}
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
            Alias: "Add EspressoDemo",
            TaskID: "TaskQueue3",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"EspressoDemo",
                    ReplaceData: {}
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
            Alias: "Add TransfertoCommu",
            TaskID: "TaskQueue4",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Target:"TransfertoCommu",
                    Task:"Task_TransferBasic",
                    ReplaceData: {
                        newDeviceName: "コミュ",
                        newClientID: "{{コミュ_ID}}"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "null",
            Status: "Waiting"
        },

        
    ]
};