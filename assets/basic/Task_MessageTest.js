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
export const Task_MessageTest = {
    Type: "TaskFlow",
    Alias: "MessageTest",
    TaskID: "Task_MessageTest",
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
                    event: "notify.event",
                    data: {
                        message: "Message1 Sended"
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
            Dependenceis: "null",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "SubFlow",
            TaskID: "TF1",
            Dependenceis: "T1",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "ReplaceTest",
                    TaskID: "T2",
                    ToDo: {
                        Method: "Replace",
                        Data: {
                            Target: "T2",
                            Task: "ReplaceTest",
                            ReplaceData: {
                                message: "Replace Succeeded"
                            }
                        }
                    },
                    Check: {
                        Method: "null"
                    },
                    Dependenceis: "null",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "Message2",
                    TaskID: "T3",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "notify.event",
                            data: {
                                message: "Message2 Sended"
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
                    Dependenceis: "T2",
                    Status: "Waiting"
                }
            ]
        },
        {
            Type: "SubTask",
            Alias: "Message3",
            TaskID: "T4",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "notify.event",
                    data: {
                        message: "Message3 Sended"
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
            Dependenceis: "TF1",
            Status: "Waiting"
        }
    ]
};