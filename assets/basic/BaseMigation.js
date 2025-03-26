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
export const BaseMigration = {
    Hidden: true,
    Type: "TaskFlow",
    Alias: "Migrate to {{newDeviceName}}",
    TaskID: "BaseMigration",
    Dependencies: "null",
    Status: "Waiting",
    Requirements: [
        "newDeviceName","newClientID"
    ],
    Flow: [
        {
            Type: "SubTask",
            Alias: "ChangeTurnEndTypeBeforeTransfer",
            TaskID: "changeturnendtypebeforetransfer",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "none"
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
            Alias: "タスク一時停止",
            TaskID: "PauseTask",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "notify.event",
                    data: {
                        message: "乗り移り一時停止中です。以下のボタンを押すと、乗り移りを開始します。"
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
            Dependencies: "changeturnendtypebeforetransfer",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "DisappearMotion",
            TaskID: "DisappearMotion",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command: "disappear"
                    }
                }
            },
            Check: {
                /*
                Method: "GetNomadEvent",
                Data: {
                    event: "message.event",
                    data: {
                        message: "confirm"
                    }
                }¥*/
                Method: "WaitUntil",//デバッグのため一時的にWaitUntilに変更
                Data: {
                    time: 1000
                }
            },
            Dependencies: "changeturnendtypebeforetransfer",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "現在のデバイスを更新",
            TaskID: "Migration",
            ToDo: {
                Method: "Transfer",
                Data: {
                    newClientID: "{{newClientID}}"
                }
            },
            Check: {
                
                Method: "GetNomadEvent",
                Data: {
                    event: "relay.event",
                    data:{
                        CurrentClient: "{{newClientID}}"
                    }
                }
                    
            },
            Dependencies: "DisappearMotion",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "AppearMotion",
            TaskID: "AppearMotion",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command: "appear"
                    }
                }
            },
            Check: {
                /*
                Method: "GetNomadEvent",
                Data: {
                    event: "message.event",
                    data: {
                        message: "confirm"
                    }
                }
                */
                Method: "WaitUntil",
                Data: {
                    time: 1000
                }
            },
            Dependencies: "Migration",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ChangeTurnEndTypeAfterTransfer",
            TaskID: "changeturnendtypeaftertransfer",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "server_vad"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "AppearMotion",
            Status: "Waiting"
        },

    ]
};