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
export const Intorduction = {
    Type: "TaskFlow",
    Alias: "自己紹介",
    TaskID: "introduction",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "Instruction更新",
            TaskID: "updateinstruction",
            ToDo:{
                Method: "UpdateInstruction",
                Data: {
                    instructions: `{{headerinstructions}}
                    あなたはユーザをこの部屋で楽しませる対話アシスタントです。
                    初対面のユーザと仲良くなるために、以下の目的を達成するように会話を行なってください。
                    また、目的を達成した時の報告TaskReportを忘れないでください。
                    * 0:ユーザの名前を聞いてください。
                    * 1:ユーザの好きな食べ物を聞いてください。
                    * 2:ユーザの職業を聞いてください。
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
            Alias: "TaskHandlerに登録",
            TaskID: "settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["AskName", "AskFood", "AskJob"]
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ブラウザに出現",
            TaskID: "appearbrowser",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "client.event",
                    data: {
                        command:"appear"
                    }
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "settaskhandler",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "対話パート",
            TaskID: "conversationflow",
            Dependencies: "appearbrowser",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "名前を聞く",
                    TaskID: "AskName",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「0:ユーザの名前を聞いてください。」を実行してください。"
                            }
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
                    Alias: "名前が聞けた",
                    TaskID: "ComplietedName",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "client.event",
                            data: {
                                command:"hello"
                            }
                        }
                    },
                    Check: {
                        Method: "null"
                    },
                    Dependencies: "AskName",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "好きな食べ物を聞く",
                    TaskID: "AskFood",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「1:ユーザの好きな食べ物を聞いてください。」を実行してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "AskName",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "食べ物が聞けた",
                    TaskID: "ComplietedFood",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "client.event",
                            data: {
                                command:"hello"
                            }
                        }
                    },
                    Check: {
                        Method: "null"
                    },
                    Dependencies: "AskFood",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "職業を聞く",
                    TaskID: "AskJob",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "ステップ「2:ユーザの職業を聞いてください。」を実行してください。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "AskFood",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "職業が聞けた",
                    TaskID: "ComplietedJob",
                    ToDo: {
                        Method: "PostNomadEvent",
                        Data: {
                            event: "client.event",
                            data: {
                                command:"hello"
                            }
                        }
                    },
                    Check: {
                        Method: "null"
                    },
                    Dependencies: "AskJob",
                    Status: "Waiting"
                }
            ]
        },
        {
            Type: "SubTask",
            Alias: "Instruction初期化",
            TaskID: "resetinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: "{{headerinstructions}}{{defaultinstructions}}{{footerinstructions}}"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "conversationflow",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "TaskHandler初期化",
            TaskID: "resettaskhandler",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "resetinstruction",
            Status: "Waiting"
        }
    ]
}
