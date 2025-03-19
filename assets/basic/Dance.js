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
export const Dance = {
    Type: "TaskFlow",
    Alias: "ダンス",
    TaskID: "Dance",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "CommUダンス",
            TaskID: "CommuDance",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command:"dance"
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
            Dependencies: "null",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ランプへ乗り移り",
            TaskID: "MigrateToLamp",
            ToDo: {
                Method: "Replace",
                Data: {
                    Target: "MigrateToLamp",
                    Task: "BaseMigration",
                    ReplaceData: {
                        newDeviceName: "ランプ",
                        newClientID: "{{ランプ_ID}}"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "CommuDance",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "Lampダンス",
            TaskID: "LampDance",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command:"dance"
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
            Dependencies: "MigrateToLamp",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "テレビへ乗り移り",
            TaskID: "MigrateToTv",
            ToDo: {
                Method: "Replace",
                Data: {
                    Target: "MigrateToTv",
                    Task: "BaseMigration",
                    ReplaceData: {
                        newDeviceName: "テレビ",
                        newClientID: "{{テレビ_ID}}"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "LampDance",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "テレビダンス",
            TaskID: "TvDance",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command:"dance"
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
            Dependencies: "MigrateToTv",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "乗り移ったよ",
            TaskID: "ExplainMigration",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "ユーザに、踊り終わったこと、疲れたことを教えてください。"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "TvDance",
            Status: "Waiting"
        },
    ]
}