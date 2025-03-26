import type { ToDo, NomadEvent, Task } from './StateManagerUtils';
import { StateManagerUtils } from './StateManagerUtils';
import { RealtimeStore } from '@/stores/APIClientStore';

const { TaskScheduler, renderTemplate, findTaskById, replaceTaskById, convertTaskIds, sleep } = StateManagerUtils();
export const StateManager = () => {
    const realtimestore = RealtimeStore();
    let basictasks: { [key: string]: Task } = {};
    const reloadqueue = ref<boolean>(false);
    const TaskQueue = ref<Task>({ Type: 'TaskFlow', TaskID: 'TaskQueue', Dependencies: null, Status: 'Waiting', Flow: [] });
    const Eventprocessor: { [key: string]: (event: ToDo) => boolean | Promise<boolean> } = {
        'null': (event: ToDo) => {
            return true;
        },
        'PostNomadEvent': (event: ToDo) => {
            if (event.Data as NomadEvent) {
                realtimestore.client?.sendNomadEvent(event.Data);
                return true;
            }
            return false;
        },
        'TaskQueue': (event: ToDo) => {
            if (typeof event.Data.Task === 'string') {
                const taskId = event.Data.Task;
                let task = basictasks[taskId];
                if (!task) {
                    log(`Task with ID ${taskId} not found`);
                    return false;
                }
                if (event.Data.ReplaceData as { [key: string]: string }) {
                    task = renderTemplate(task, event.Data.ReplaceData);
                    if (task.Requirements) {
                        for (const req of task.Requirements) {
                            if (!event.Data.ReplaceData.hasOwnProperty(req)) {
                                log(`Requirement ${req} is not satisfied in ReplaceData`);
                                return false;
                            }
                        }
                    }
                }
                if (basictasks["defaultconfig"].ToDo?.Data as { [key: string]: string }) {
                    task = renderTemplate(task, basictasks["defaultconfig"].ToDo?.Data as { [key: string]: string });
                }

                TaskQueue.value.Flow?.push(convertTaskIds(task));
                log(`Task ${task.TaskID} added to queue`);
                return true;
            }
            return false;
        },
        'Replace': (event: ToDo) => {
            if (typeof event.Data.Task === 'string') {
                const taskId = event.Data.Task;
                const targetId = event.Data.Target;
                let task = basictasks[taskId];
                if (!task) {
                    log(`Task with ID ${taskId} not found`);
                    return false;
                }
                if (event.Data.ReplaceData as { [key: string]: string }) {
                    task = renderTemplate(task, event.Data.ReplaceData);
                    if (task.Requirements) {
                        for (const req of task.Requirements) {
                            if (!event.Data.ReplaceData.hasOwnProperty(req)) {
                                log(`Requirement ${req} is not satisfied in ReplaceData`);
                                return false;
                            }
                        }
                    }
                }
                if (basictasks["defaultconfig"].ToDo?.Data as { [key: string]: string }) {
                    task = renderTemplate(task, basictasks["defaultconfig"].ToDo?.Data as { [key: string]: string });
                }
                return replaceTaskById(convertTaskIds(task), TaskQueue.value, targetId);


            }
            return false;
        },
        'UpdateInstruction': (event: ToDo) => {
            if (event.Data.instructions) {
                realtimestore.client?.updateSession({ instructions: event.Data.instructions });
                notify('UpdateInstruction called');
                return true;
            }

            return false;

        },
        'CreateResponse': (event: ToDo) => {
            if (event.Data) {
                realtimestore.client?.realtime.send('response.create', event.Data);
                return true;
            }
            return false;
        },
        'CreateResponse2': (event: ToDo) => {
            if (event.Data.instructions) {
                const data = {
                    item: {
                        type: "message",
                        role: "system",
                        content: [
                            {
                                type: "input_text",
                                text: event.Data.instructions,
                            }
                        ]
                    }
                }
                realtimestore.client?.realtime.send('conversation.item.create', data);
                realtimestore.client?.createResponse();
                return true;
            }
            return false;
        },
        'DirectResponse': (event: ToDo) => {
            if (event.Data.text) {
                const data = {
                    item: {
                        type: "message",
                        role: "system",
                        content: [
                            {
                                type: "input_text",
                                text: `そのまま以下の文を発話してください。「${event.Data.text}」`,
                            }
                        ]
                    }
                }
                realtimestore.client?.realtime.send('conversation.item.create', data);
                realtimestore.client?.createResponse();
                return true;
            }
            return false;
        },
        'ForcelyToggleTaskStatus': (event: ToDo) => {
            if (event.Data.TaskID) {
                const task = findTaskById(TaskQueue.value, event.Data.TaskID);
                if (task) {
                    task.Status = task.Status === 'Waiting' ? 'Completed' : 'Waiting';
                    reloadqueue.value = true;
                    log(`Task ${task.TaskID} status toggled`);
                    return true;
                }
            }
            log(`Task ${event.Data.TaskID} not found`);
            return false;
        },
        'Reload': (event: ToDo) => {
            reloadqueue.value = true;
            return true;
        },
        'SetTaskHandler': (event: ToDo) => {
            if (event.Data.Target) {
                const tool = {
                    "name": "TaskReport",
                    "description": "各タスクが完了したら必ず報告してください。",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "Num": {
                                "type": "number",
                                "description": "タスクの番号を指定。"
                            },
                            "Status": {
                                "type": "boolean",
                                "description": "タスクの状態を指定。成功していればTrue、失敗していればFalseを出力してください。"
                            },

                            "Comments": {
                                "type": "string",
                                "description": "報告内容を裏付けるゲストの発話を入力してください。"
                            }
                        },
                        "required": ["Num", "Status", "Comments"]
                    }
                };
                const TaskKEY: string[] = [];
                for (const TaskID of event.Data.Target) {
                    log(`TaskID:${TaskID}`);
                    TaskKEY.push(TaskID);
                }
                log(`TaskKEY:${TaskKEY}`);
                const func = ({ Num, Status, Comments }: { Num: number, Status: boolean, Comments: string }) => {
                    log(`FunctionCalled${Num}${Status}${Comments}`)
                    if (Status) {

                        const task = findTaskById(TaskQueue.value, TaskKEY[Num]);
                        if (task) {
                            task.Status = 'Completed';
                            reloadqueue.value = true;
                            log(`タスク${Num}は正常に完了しました。${Comments}`);
                            return { feedback: "報告を受理しました。" };
                        }
                        else {
                            log(`タスク${Num}が見つかりませんでした。`);
                            return { feedback: "エラー：タスクが見つかりませんでした。" };
                        }
                    }
                    else {
                        const task = findTaskById(TaskQueue.value, TaskKEY[Num]);
                        if (task) {
                            task.Status = 'Waiting';
                            reloadqueue.value = true;
                            log(`タスク${Num}の失敗が確認されました。${Comments}`);
                            return { feedback: "タスクの失敗が確認されました。" };
                        }
                        else {
                            log(`タスク${Num}が見つかりませんでした。`);
                            return { feedback: "エラー：タスクが見つかりませんでした。" };
                        }
                    }
                    //return {feedback:"エラー：タスクの状態が変更されませんでした。"};
                };
                realtimestore.client?.addTool(tool, func);
                return true;
            }
            return false;
        },
        'ResetTaskHandler': (event: ToDo) => {
            try{
                realtimestore.client?.removeTool("TaskReport");
                realtimestore.client?.updateSession();
            }
            catch(e){
                log(`This is NOT error:${e}`);
            }

            return true;
        },
        'UpdateSession': (event: ToDo) => {
            if (event.Data) {
                realtimestore.client?.updateSession(event.Data);
                notify('UpdateSession called');
                return true;
            }

            return false;

        },
        'ChangeTurnEndType': (event: ToDo) => {
            console.log('ChangeTurnEndType called');
            if (event.Data.value === 'none') {
                realtimestore.client?.updateSession({
                    turn_detection: null
                });
            } else if(event.Data.value === 'server_vad'){ 
                realtimestore.client?.updateSession({
                    turn_detection: {
                        type: 'server_vad',
                    },
                });
            }
            else if(event.Data.value === 'semantic_vad'){ 
                realtimestore.client?.updateSession({
                    turn_detection: {
                        type: 'semantic_vad',
                    },
                });
            }
            else{return false;}
            notify('ChangeTurnEndType called');
            return true;
        },
        'ReloadBasicTasks': async (event: ToDo) => {
            await reloadtasks();
            notify('ReloadBasicTasks called');
            return true;
        },
        'Transfer': (event: ToDo) => {
            if (event.Data.newClientID) {
                realtimestore.client?.sendNomadEvent({ event: "transfer.event", data: { newClient: event.Data.newClientID } });
                return true;
            }
            return false;
        }


    }
    const CheckProcessor: { [key: string]: (check: ToDo) => boolean | Promise<boolean> } = {
        'null': (check: ToDo) => {
            return true;
        },
        'Wait': async (check: ToDo) => {
            await sleep(100000)//100秒待機
            return false;
        },
        'WaitUntil': async (check: ToDo) => {
            if (check.Data.time) {
                const time = check.Data.time as number;
                await sleep(time);
                return true;
            }
            return false;
        },
        'GetNomadEvent': async (check: ToDo) => {
            console.log('GetNomadEvent called');
            return new Promise((resolve) => {
                const stop = watchEffect(() => {
                    if (realtimestore.NomadEvents.length === 0) return;
                    const event = realtimestore.NomadEvents[realtimestore.NomadEvents.length - 1].event as NomadEvent;
                    if (check.Data as NomadEvent) {
                        if (check.Data.event === event.event) {
                            console.log('Event names match');
                            let allMatch = true;
                            for (const key in check.Data.data) {
                                if (check.Data.data[key] !== event.data[key]) {
                                    console.log(`Data mismatch for key ${key}: expected ${check.Data.data[key]}, got ${event.data[key]}`);
                                    allMatch = false;
                                    break;
                                }
                            }
                            if (allMatch) {
                                console.log('All data match');
                                stop();
                                resolve(true);
                            }
                        } else {
                            console.log('Event names do not match');
                        }
                    } else {
                        console.log('Check data is not a NomadEvent');
                    }
                });
            });
        },
        'GetRealtimeEvent': async (check: ToDo) => {
            console.log('GetRealtimeEvent called');
            return new Promise((resolve) => {
                const stop = watchEffect(() => {
                    if (realtimestore.realtimeEvents.length === 0) return;
                    const event = realtimestore.realtimeEvents[realtimestore.realtimeEvents.length - 1].event;
                    if (check.Data) {
                        if (check.Data.type === event.type) {
                            console.log('Event names match');

                            let allMatch = true;
                            if (allMatch) {
                                console.log('All data match');
                                stop();
                                resolve(true);
                            }
                        } else {
                            console.log('Event names do not match');
                        }
                    } else {
                        console.log('Check data is not a NomadEvent');
                    }
                });
            });
        },
    }

    async function setStateManager() {
        const data: Task[] = await $fetch('api/load');
        const tasks = Object.values(data) as Task[];
        tasks.forEach(task => {
            basictasks[task.TaskID] = task;
        });

        NomadEventsHandler();
        TaskHandler();
    }
    function reset() {
        TaskQueue.value.Flow = [];
        TaskQueue.value.Status = 'Waiting';
        log(JSON.stringify(TaskQueue.value));
    }
    async function reloadtasks() {
        basictasks = {};
        const data: Task[] = await $fetch('api/load');
        const tasks = Object.values(data) as Task[];
        tasks.forEach(task => {
            basictasks[task.TaskID] = task;
        });
        for (const key in realtimestore.RelayStatus.UserPeers) {
            console.log(`UserPeers:${key}:${realtimestore.RelayStatus.UserPeers[key]}`);
            const username = realtimestore.RelayStatus.UserPeers[key];
            if (basictasks["defaultconfig"].ToDo?.Data) {
                basictasks["defaultconfig"].ToDo!.Data[username + '_ID'] = key;
                console.log(basictasks["defaultconfig"].ToDo!.Data);
            }
        }
        console.log(basictasks);
    }

    function NomadEventsHandler() {
        watch(realtimestore.NomadEvents, async () => {
            if (realtimestore.NomadEvents.length > 0) {
                const latestEvent = realtimestore.NomadEvents[realtimestore.NomadEvents.length - 1];
                if (latestEvent.event.event === 'relay.event') {
                    realtimestore.RelayStatus.APIconnection = latestEvent.event.data.APIconnection;
                    realtimestore.RelayStatus.UserPeers = latestEvent.event.data.userpeers;
                    realtimestore.RelayStatus.ConsolePeers = latestEvent.event.data.consolepeers;
                    realtimestore.RelayStatus.CurrentClient = latestEvent.event.data.CurrentClient;
                    for (const key in realtimestore.RelayStatus.UserPeers) {
                        console.log(`UserPeers:${key}:${realtimestore.RelayStatus.UserPeers[key]}`);
                        const username = realtimestore.RelayStatus.UserPeers[key];
                        if (basictasks["defaultconfig"].ToDo?.Data) {
                            basictasks["defaultconfig"].ToDo!.Data[username + '_ID'] = key;
                            console.log(basictasks["defaultconfig"].ToDo!.Data);
                        }
                    }
                }
                else if (latestEvent.event.event === 'control.event') {
                    await Eventprocessor[latestEvent.event.data.Method]({ Method: latestEvent.event.data.Method, Data: latestEvent.event.data.Data });
                    log(`Control event: ${latestEvent.event.data.Method}`);
                }
                else if (latestEvent.event.event in basictasks) {
                    const task = basictasks[latestEvent.event.event];
                    Eventprocessor['TaskQueue']({ Method: 'TaskQueue', Data: { Task: task.TaskID, ReplaceData: latestEvent.event.data } });
                }

            }
        });
    }


    function TaskHandler() {
        watch(TaskQueue, () => {
            realtimestore.client?.sendNomadEvent({ event: "state.event", data: TaskQueue.value });
            const SubTask = TaskScheduler(TaskQueue.value);
            if (SubTask) {
                if (SubTask.ToDo?.Method === 'TaskQueue') {
                    SubTask.Status = 'Completed';
                    Eventprocessor['TaskQueue']({ Method: 'TaskQueue', Data: { Task: SubTask.ToDo.Data.Task, ReplaceData: SubTask.ToDo.Data.ReplaceData } });
                }
                else {
                    if (TaskExecutor(SubTask)) {
                        TaskChecker(SubTask);
                        realtimestore.client?.sendNomadEvent({ event: "state.event", data: TaskQueue.value });
                    }
                    else {
                        log(`Task ${SubTask.TaskID} failed to execute`);
                    }
                }
            }
        }, { deep: true });
    }

    // タスクのメソッドの実行
    function TaskExecutor(task: Task) {
        log(`Executing Task: ${task.TaskID}`);
        if (task.ToDo) {
            const method = Eventprocessor[task.ToDo.Method];
            if (method) {
                const success = method(task.ToDo);
                if (success) {
                    log(`Task ${task.TaskID} completed successfully`);
                    return true;
                } else {
                    log(`Task ${task.TaskID} failed to execute`);
                }
            } else {
                log(`Method ${task.ToDo.Method} not found for Task ${task.TaskID}`);
            }
        } else {
            log(`No ToDo found for Task ${task.TaskID}`);
        }
        return false;

    }

    // タスクのチェックを実行
    async function TaskChecker(task: Task) {
        log(`Checking Task: ${task.TaskID}`);
        if (task.Check) {
            const checkMethod = CheckProcessor[task.Check.Method];
            if (checkMethod) {
                console.log('check start');
                const stop = watch(reloadqueue, (newValue) => {
                    if (newValue) {
                        stop();
                        reloadqueue.value = false;
                        log(`Task ${task.TaskID} check interrupted due to reloadqueue`);
                        return;
                    }
                });
                const success = await checkMethod(task.Check);
                if (success) {
                    task.Status = 'Completed';
                    log(`Task ${task.TaskID} check passed`);
                } else {
                    log(`Task ${task.TaskID} check failed`);
                }
            } else {
                log(`Check method ${task.Check.Method} not found for Task ${task.TaskID}`);
            }
        } else {
            log(`No Check found for Task ${task.TaskID}`);
        }
    }

    function log(message: string) {
        const logMessage = `${message}`;
        if (realtimestore.client) {
            realtimestore.client.sendNomadEvent({ event: "log.event", data: { message: logMessage } });
        }
        console.log(logMessage);
    }
    function notify(message: string) {
        const notifyMessage = `${message}`;
        if (realtimestore.client) {
            const Status = JSON.parse(JSON.stringify(realtimestore.client.sessionConfig));
            const tasks = JSON.parse(JSON.stringify(basictasks));
            realtimestore.client.sendNomadEvent({ event: "log.event", data: { status: Status, message: notifyMessage, basictasks: tasks } });
        }

        console.log(notifyMessage);
    }

    return {
        setStateManager,
        reset,
        reloadtasks
    }
}
