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
export const Task_EspressoDemo = {
    Type: "TaskFlow",
    Alias: "EspressoDemo",
    TaskID: "EspressoDemo",
    Dependencies: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "UpdateInstruction",
            TaskID: "updateinstruction",
            ToDo: {
                Method: "UpdateInstruction",
                Data: {
                    instructions: `{{headerinstructions}}
                    これからユーザーに「一杯のエスプレッソを淹れる」タスクをさせます。以下のステップを順番に行わせてください。
                    また、ユーザーがタスクを完了させた時の報告TaskReportを忘れないでください。
                    * 0:ユーザーにタスクを開始する準備ができたかどうかの確認をとる。確認が取れたら次に進む。
                    * 1:給水タンクに水が満水になっているか確認する。
                    * 2:フィルターホルダーにシングルスパウトを取り付ける。
                    * 3:フィルターホルダーにシングルフィルターを取り付ける。
                    * 4:フィルターホルダーにコーヒー粉を詰める。
                    * 5:フィルターホルダーをエスプレッソマシン本体に取り付ける。
                    * 6:カップをセットする。
                    * 7:電源を入れる。
                    * 8:自動コーヒーボタンを押す。
                    * 9:エスプレッソが適切に抽出されているかどうか確認し、問題がなければタスクを完了する。
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
            Alias: "SetTaskHandler",
            TaskID: "settaskhandler",
            ToDo: {
                Method: "SetTaskHandler",
                Data: {
                    Target: ["Task0", "Task1", "Task2","Task3", "Task4", "Task5","Task6", "Task7", "Task8","Task9"]
                }
            },
            Check: {
                Method: "null"
            },
            Dependencies: "updateinstruction",
            Status: "Waiting"
        },
        {
            Type: "TaskFlow",
            Alias: "MainTaskFlow",
            TaskID: "maintaskflow",
            Dependencies: "settaskhandler",
            Status: "Waiting",
            Flow: [
                {
                    Type: "SubTask",
                    Alias: "ステップ１：ユーザーの確認",
                    TaskID: "Task0",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 0:ユーザーにタスクを開始する準備ができたかどうかの確認をとる。確認が取れたら次に進む。"
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
                    Alias: "ステップ２：水を入れる",
                    TaskID: "Task1",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 1:給水タンクに水が満水になっているか確認する。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task0",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ３：シングルスパウトを取り付ける",
                    TaskID: "Task2",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 2:フィルターホルダーにシングルスパウトを取り付ける。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task0",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ４：シングルフィルターを取り付ける",
                    TaskID: "Task3",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 3:フィルターホルダーにシングルフィルターを取り付ける。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task0",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ５：コーヒー粉を詰める",
                    TaskID: "Task4",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 4:フィルターホルダーにコーヒー粉を詰める。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task3",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ６：本体に取り付ける",
                    TaskID: "Task5",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 5:フィルターホルダーをエスプレッソマシン本体に取り付ける。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task4",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ７：カップをセットする",
                    TaskID: "Task6",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 6:カップをセットする。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task5",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ８：電源を入れる",
                    TaskID: "Task7",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 7:電源を入れる。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task1",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ９：自動コーヒーボタンを押す",
                    TaskID: "Task8",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 8:自動コーヒーボタンを押す。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task7",
                    Status: "Waiting"
                },
                {
                    Type: "SubTask",
                    Alias: "ステップ１０：抽出を確認する",
                    TaskID: "Task9",
                    ToDo: {
                        Method: "CreateResponse",
                        Data: {
                            response: {
                                instructions: "* 9:エスプレッソが適切に抽出されているかどうか確認し、問題がなければタスクを完了する。"
                            }
                        }
                    },
                    Check: {
                        Method: "Wait"
                    },
                    Dependencies: "Task8",
                    Status: "Waiting"
                }
            ]
        },
        {
            Type: "SubTask",
            Alias: "ResetInstruction",
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
            Dependencies: "maintaskflow",
            Status: "Waiting"
        },
        {
            Type: "SubTask",
            Alias: "ResetTaskHandler",
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
};