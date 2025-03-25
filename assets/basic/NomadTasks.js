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
            Alias: "Add Init",
            TaskID: "TaskQueue0",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"Init",
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
            Alias: "Add TransferToEarbuds",
            TaskID: "TaskQueue2",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"BaseMigration",
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
            Alias: "Add EspressoShort",
            TaskID: "TaskQueue3",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"EspressoShort",
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
            Alias: "Add TransfertoRobot",
            TaskID: "TaskQueue4",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"BaseMigration",
                    ReplaceData: {
                        newDeviceName: "ロボット",
                        newClientID: "{{ロボット_ID}}"
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
            Alias: "Add RobotDemo",
            TaskID: "TaskQueue5",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"RobotDemo",
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
            Alias: "Add Ending",
            TaskID: "TaskQueue6",
            ToDo: {
                Method: "TaskQueue",
                Data: {
                    Task:"Ending",
                    ReplaceData: {}
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