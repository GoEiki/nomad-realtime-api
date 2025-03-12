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
export const Task_Test1 = {
    Type: "TaskFlow",
    Alias: "テスト",
    TaskID: "Task_Test1",
    Dependenceis: "null",
    Status: "Waiting",
    Flow: [
        {
            Type: "SubTask",
            Alias: "発話",
            TaskID: "Task_Test1_Speech",
            ToDo:{
                Method: "CreateResponse",
                Data: {
                    response: {
                        instructions: "乗り移ります。と言ってください。"
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
            Alias: "乗り移り前表現",
            TaskID: "Task_Test1_agentout",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "motion.event",
                    data: {
                        motion:"Agentout"
                    }//{event:"motion.event",data:{motion:"Agentout"}}
                }
            },
            Check: {
                Method: "null",
            },
            Dependenceis: "Task_Test1_Speech",
            Status: "Waiting"
        },
        //Method:Transfer
        {
            Type: "SubTask",
            Alias: "乗り移り後表現",
            TaskID: "Task_Test1_agentin",
            ToDo: {
                Method: "PostNomadEvent",
                Data: {
                    event: "motion.event",
                    data: {
                        motion:"Agentin"
                    }
                }
            },
            Check: {
                Method: "null",
            },
            Dependenceis: "Task_Test1_agentout",
            Status: "Waiting"
        },
    ]
}
