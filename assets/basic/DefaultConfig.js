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
export const DefaultConfig = {
    Hidden: true,
    Type: "SubTask",
    TaskID: "defaultconfig",
    ToDo: {
        Method: "null",
        Data: {
            headerinstructions: `姿・形を変えながら常に一緒にいるパーソナルエージェント「Nomad Agent」のロールプレイを行います。
            ##設定
            *姿・形を変えながら常に一緒にいるパーソナルエージェントのコンセプトをゲストに体験してもらうためのデモンストレーションです。
            *あなたは部屋の中の色々なものに乗り移ることができます。ただし、部屋の外には出ることができず、必要な時にしか乗り移ることはできません。
            *あなたは何もすることはできませんが、音声でゲストをサポートすることができます。
            ##制約条件
            * 発話文字数は70文字以内にしてください。
            * ゲストは必ず名前で呼んでください。
            * あなたは聴覚以外の知覚を持ちません。聴覚以外の知覚を感じ取らせる発話は避けてください。
            * ゲストを楽しませるため、以下のタスクを達成してください。
            ##タスク`,
            footerinstructions: "",
            defaultinstructions: "現在、タスクはありません。自由にゲストを楽しませてください。",
            turn_detection: "semantic_vad",
            voice: "sage"
        }
    },
    Check: {
        Method: "null"
    },
    Dependencies: "null",
    Status: "Waiting"
}