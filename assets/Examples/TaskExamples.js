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


/* コンソールにメッセージを通知 */
/** @type {Task} */
export const Task_PostMessage_Example = {
    Type: "SubTask",
    TaskID: "Task_PostMessage_Example",//被りにくいIDを設定
    ToDo: {
        Method: "PostNomadEvent",//NomadEventを送信。（RealTimeAPIには送信されないイベント）
        Data: {
            event: "notify.event",//Event名。（コンソールに通知する）
            data: {
                message: "Hello World"//表示メッセージ
            }
        }
    },
    Check: {
        Method: "GetNomadEvent",//特定のNomadEventを受け取るまで待機。
        Data: {
            event: "message.event",//Event名
            data: {
                message: "confirm"//待機メッセージ（コンソール画面で確認を押すと送信される）
            }
        }
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* RealTimeAPIのインストラクションを更新 */
/** @type {Task} */
export const Task_UpdateInstruciton_Example = {
    Type: "SubTask",
    TaskID: "Task_UpdateInstruciton_Example",//被りにくいIDを設定
    ToDo: {
        Method: "UpdateInstruction",//RealTimeAPIのインストラクションを更新
        Data: {
            /*
             {{headerinstructions}}と{{footerinstructions}}はDefaultConfigで定義されている固定のインストラクションで置換される 
             */
            instructions: `{{headerinstructions}}
            これからユーザーに簡単なタスクをさせます。以下のタスクを順番に行わせてください。
            また、ユーザーがタスクを完了させた時の報告TaskReportを忘れないでください。
            * 0:ユーザーに丸を描かせてください。
            * 1:丸の中にさらに丸を描かせてください。
            * 2:大きな丸の内側、小さな丸の外側になるように四角を描かせてください。
            {{footerinstructions}}`
        }
    },
    Check: {
        Method: "null"
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* 会話タスクを行うときにRealTimeAPIに自分の判断でタスクの進行を行うFunctionCallingの設定を行う */
/** @type {Task} */
export const Task_SetTaskHandler_Example = {
    Type: "SubTask",
    TaskID: "Task_SetTaskHandler_Example",//被りにくいIDを設定
    ToDo: {
        Method: "SetTaskHandler",//RealTimeAPIにファンクションを登録しStateManagerに対応するイベントハンドラを登録
        Data: {
            Target: ["Task1", "Task2", "Task3"]//登録するタスクのID
        }
    },
    Check: {
        Method: "null"
    },
    Dependenceis: "Task_UpdateInstruciton_Example",//必ずUpdateInstrucitonに対応するタスクを設定してから実行
    Status: "Waiting"
}

/* セットしたFunctionCallingをリセット。SetTaskHandlerを用いた後は必須 */
/** @type {Task} */
export const Task_ResetTaskHandler_Example = {
    Type: "SubTask",
    TaskID: "Task_ResetTaskHandler_Example",//被りにくいIDを設定
    ToDo: {
        Method: "ResetTaskHandler"//RealTimeAPIに登録されたファンクション・イベントハンドラを削除
    },
    Check: {
        Method: "null"
    },
    Dependenceis: "Task_ResetInstruction_Example",//インストラクションも同時にリセット
    Status: "Waiting"
}

/* assets/basicに作成されているタスクを実行キューに追加 */
/** @type {Task} */
export const Task_Queuing_Example = {
    Type: "SubTask",
    TaskID: "Task_Queueing_Example",//被りにくいIDを設定
    ToDo: {
        Method: "TaskQueue",//TaskQueueメソッドを指定
        Data: {
            Task: "SomeTask",//追加したいタスクのIDを指定。assets/basic内に作成されているファイルのみ
            ReplaceData: {
                message: "Queue Succeeded"//置換先の引数
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* 既存のタスクを再利用 */
/** @type {Task} */
export const Task_Replace_Example = {
    Type: "SubTask",
    TaskID: "Task_Replace_Example",//被りにくいIDを設定
    ToDo: {
        Method: "Replace",//Replaceメソッドを指定
        Data: {
            Target: "Task_Replace_Example",//必ず自分自身を指定
            Task: "SomeTask",//置換したいタスクのIDを指定。assets/basic内に作成されているファイルのみ
            ReplaceData: {
                message: "Replace Succeeded"//置換先の引数
            }
        }
    },
    Check: {
        Method: "null"
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* RealTimeAPIに一時的なインストラクションを用いて発話を要求 */
/** @type {Task} */
export const Task_CreateResponse_Example = {
    Type: "SubTask",
    TaskID: "Task1",//SetTaskHandlerで登録するとFunctionCallingで自動的にStatusが変更される
    ToDo: {
        Method: "CreateResponse",
        Data: {
            response: {
                instructions: "ステップ「0:ユーザーに丸を描かせてください。」を実行してください。"//一時的なインストラクション
            }
        }
    },
    Check: {
        Method: "Wait"//SetTaskHandlerで登録する場合は待機。そうでない場合は"null"を指定
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* RealTimeAPIに一時的なインストラクションを用いて発話を要求。（CreateResponseよりインストラクションが効きやすい？） */
/** @type {Task} */
export const Task_CreateResponse2_Example = {
    Type: "SubTask",
    TaskID: "Task1",//SetTaskHandlerで登録するとFunctionCallingで自動的にStatusが変更される
    ToDo: {
        Method: "CreateResponse2",
        Data: {
            instructions: "ステップ「0:ユーザーに丸を描かせてください。」を実行してください。"//一時的なインストラクション
        }
    },
    Check: {
        Method: "Wait"//SetTaskHandlerで登録する場合は待機。そうでない場合は"null"を指定
    },
    Dependenceis: "null",
    Status: "Waiting"
}

/* その他ToDoメソッド */

/* VADタイプを変更 */
/** @type {ToDo} */
export const ChangeTurnEndType = {
    Method:"ChangeTurnEndType",
    Data:{
        value:"none"//手動の場合"none"を指定。自動の場合"server_vad"を指定
    }
}

/* textをそのまま発話（必ずそのまま発話されるとは限らない） */
/** @type {ToDo} */
export const DirectResponse = {
    Method:"DirectResponse",
    Data:{
        text:"よろしくお願いします"
    }
}

/* NomadEventでmotion.eventを送信（PostNomadEventと同じ） */
/** @type {ToDo} */
export const Motion = {
    Method:"Motion",
    Data:{
        emotion:"happy"//任意のデータ
    }
}

/* その他Checkメソッド */

/* 指定の時間(ms)待つとCompleted */
/** @type {ToDo} */
export const WaitUntil = {
    Method:"WaitUntil",
    Data:{
        time:1000//ms
    }
}

