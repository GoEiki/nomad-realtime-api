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
                    これからゲストと初めて対面します。
                    ゲストと仲良くなるために、以下の目的をすべて達成するように会話をしてください。
                    また、目的を達成した時のFunction Callingを忘れないでください。
                    * 0:自己紹介とデモストレーションの説明をしてください。ゲストから返事があったらFunction Calling(0)を行なってください。
                    * 1:ゲストの名前を聞いてください。ゲストの名前を聞くことができたらFunction Calling(1)を行なってください。
                    * 2:ゲストの好きな食べ物を聞いてください。ゲストの好きな食べ物を聞くことができたらFunction Calling(2)を行なってください。
                    * 3:ゲストの職業を聞いてください。ゲストの職業を聞くことができたらFunction Calling(3)を行なってください。
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
                    Target: ["AgentIntroduction","AskName", "AskFood", "AskJob"]
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
            Alias: "ChangeTurnEndTypeBeforeNomadTasks",
            TaskID: "changeturnendtypebeforenomadtasks",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "none"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "settaskhandler",
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
                        message: "以下のボタンを押すと、デモンストレーションを開始します。"
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
            Dependencies: "changeturnendtypebeforenomadtasks",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "StartNomadTasks",
            TaskID: "startnomadtasks",
            ToDo: {
                Method: "ChangeTurnEndType",
                Data: {
                    value: "server_vad"
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "PauseTask",
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
                Method: "WaitUntil",//2秒待つように変更
                Data: {
                    time: 2000
                }
            },
            Dependencies: "startnomadtasks",
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
                    Alias: "自己紹介",
                    TaskID: "AgentIntroduction",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: `以下のように自己紹介とデモストレーションの説明をしてください。
                                「こんにちは、私は姿・形を変えながら常に一緒にいるパーソナルエージェント「Nomad Agent」です。
                                本日はこの部屋の色々なものに乗り移りながら、あなたをサポートさせていただきます。
                                よろしくお願いいたします！」`
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
                    Alias: "名前を聞く",
                    TaskID: "AskName",
                    ToDo: {
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "AgentIntroduction",
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
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "ComplietedName",
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
                        Method: "null",
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "ComplietedFood",
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
            Alias: "TaskHandler初期化",
            TaskID: "resettaskhandler",
            ToDo: {
                Method: "ResetTaskHandler"
            },
            Check: {
                Method: "null"
            },
            Dependencies: "conversationflow",
            Status: "Waiting"
        }
    ]
}
