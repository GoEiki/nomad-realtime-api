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
export const Task_TransferBasic = {
    Hidden: true,
    Type: "TaskFlow",
    Alias: "Transfer to {{newDeviceName}}",
    TaskID: "Task_TransferBasic",
    Dependencies: "null",
    Status: "Waiting",
    Requirements: [
        "newDeviceName","newClientID"
    ],
    Flow: [
        {
            Type: "SubTask",
            Alias: "TransferBasic_UpdateInstruction",
            TaskID: "transferbasic_updateinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: `{{headerinstructions}}
                    これから新しいデバイス{{newDeviceName}}への乗り移りを行います。以下のタスクを順番に遂行してください。
                    また、タスクを完了させた時の報告TaskReportを忘れないでください。
                    * 0:ユーザーに新しいデバイス{{newDeviceName}}へ乗り移りを行うことを伝えてください。
                    * 1:ユーザーに新しいデバイス{{newDeviceName}}への乗り移りが完了したことを伝えてください。
                    {{footerinstructions}}`
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
            Alias: "TransferBasic_SetTaskHandler",
            TaskID: "transferbasic_settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["sendmessagebeforetransfer", "sendmessageaftertransfer"],
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "transferbasic_updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "TransferBasic_MainTaskFlow",
            TaskID: "transferbasic_maintaskflow",
            Dependencies: "transferbasic_settaskhandler",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "SendMessageBeforeTransfer",
                    TaskID: "sendmessagebeforetransfer",
                    ToDo: {
                        Method: "CreateResponse2",
                        Data: {
                            instructions: `新しいデバイス{{newDeviceName}}への乗り移りを行います。
                            乗り移りを行う前に、ユーザーに乗り移ることを伝え、ユーザーからの了承を得てください。
                            (この操作が完了すると実際に乗り移りが行われ、しばらく発話することが不可能となります。)
                            例：「今から{{newDeviceName}}へ乗り移ります。」`,

                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "null",
                    Status: "Waiting"
                },
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
                    Dependencies: "sendmessagebeforetransfer",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ClientMotionBeforeTransfer",
                    TaskID: "clientmotionbeforetransfer",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "client.event",
                            data: {
                                motion: "Agentout"
                            }
                        }
                    },
                    Check: {
                        Method: "WaitUntil",
                        Data:{
                            time:3000
                        }
                    },
                    Dependencies: "changeturnendtypebeforetransfer",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "TransferBasic_Transfer",
                    TaskID: "transferbasic_transfer",
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
                    Dependencies: "clientmotionbeforetransfer",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ClientMotionAfterTransfer",
                    TaskID: "clientmotionaftertransfer",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "client.event",
                            data: {
                                motion: "Agentin"
                            }
                        }
                    },
                    Check: {
                        Method: "WaitUntil",
                        Data:{
                            time:3000
                        }
                    },
                    Dependencies: "transferbasic_transfer",
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
                    Dependencies: "clientmotionaftertransfer",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "SendMessageAfterTransfer",
                    TaskID: "sendmessageaftertransfer",
                    ToDo: {
                        Method: "CreateResponse2",
                        Data: {
                            instructions: "新しいデバイス{{newDeviceName}}への乗り移りが完了しました。"
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "changeturnendtypeaftertransfer",
                    Status: "Waiting"
                }
            ]
        },
        {
            Type: "SubTask",
            Alias: "TransferBasic_ResetInstruction",
            TaskID: "transferbasic_resetinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: "{{headerinstructions}}{{defaultinstructions}}{{footerinstructions}}"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "transferbasic_maintaskflow",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "TransferBasic_ResetTaskHandler",
            TaskID: "transferbasic_resettaskhandler",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "transferbasic_resetinstruction",
            Status: "Waiting"
        }
    ]
};