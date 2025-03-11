import { v4 as uuidv4 } from 'uuid';

export interface ManagerStatus {
    status: 'WAITING' | 'EXCUTING' | 'CHECKING' | 'SCHEDULING';
}
export interface ToDo {
    Method: string;
    Data?: any;
}
export interface Task {
    Hidden?: boolean;
    Alias?: string;
    Type: 'TaskFlow' | 'SubTask';
    TaskID: string;
    ToDo?: ToDo
    Check?: ToDo;
    Dependenceis: string | null;
    Status: 'Waiting' | 'Completed';
    Requirements?: string[];
    Flow?: Task[];
}
export interface NomadEvent {
    event: string;
    data: any;
}

export const StateManagerUtils = () => {
    function TaskScheduler(CurrentTask: any): Task | null {
        const checkDependencies = (task: Task): boolean => {
            if (task.Dependenceis === null || task.Dependenceis === "null") {
                return true;
            }
            const dependencies = task.Dependenceis.split(',');
            return dependencies.every(dep => {
                const depTask = findTaskById(CurrentTask, dep);
                return depTask && depTask.Status === 'Completed';
            });
        };

        const scheduleTasks = (taskFlow: Task): Task | null => {
            if (taskFlow.Type === 'TaskFlow' && taskFlow.Flow) {
                for (const subTask of taskFlow.Flow) {
                    if (subTask.Type === 'SubTask' && subTask.Status === 'Waiting' && checkDependencies(subTask)) {
                        return subTask;
                    }
                    if (subTask.Type === 'TaskFlow'&& subTask.Status === 'Waiting' && UpdateTaskFlowStatus(subTask)) {
                        const result = scheduleTasks(subTask);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
            return null;
        };

        return scheduleTasks(CurrentTask);
    };
    function findTaskById(taskFlow: Task, taskId: string): Task | null {
        if (taskFlow.TaskID === taskId) {
            return taskFlow;
        }
        if (taskFlow.Type === 'TaskFlow' && taskFlow.Flow) {
            for (const subTask of taskFlow.Flow) {
                const foundTask = findTaskById(subTask, taskId);
                if (foundTask) {
                    return foundTask;
                }
            }
        }
        return null;
    };

    function replaceTaskById(newTask: Task, taskFlow: Task, taskId: string): boolean {
        
        if (taskFlow.TaskID === taskId) {
            return true; // タスクが見つかったら true を返す
        }
        if (taskFlow.Type === 'TaskFlow' && taskFlow.Flow) {
            taskFlow.Flow = taskFlow.Flow.map(subTask => {
                if (subTask.TaskID === taskId) {
                    const NewTask: Task={ Type: 'TaskFlow', TaskID: taskId, Dependenceis: subTask.Dependenceis, Status: 'Waiting', Flow: [newTask]};
                    return NewTask; // 該当要素を置き換え
                }
                if (subTask.Type === 'TaskFlow') {
                    replaceTaskById(newTask, subTask, taskId);
                }
                return subTask;
            });
            return true; // 置き換えたら true を返す
        }
        return false; // 見つからなければ false
    }
    

    
    function UpdateTaskFlowStatus(taskFlow: Task) {
        if (taskFlow.Type === 'TaskFlow' && taskFlow.Flow) {
            let allCompleted = true;
            for (const subTask of taskFlow.Flow) {
                if (subTask.Status !== 'Completed') {
                    allCompleted = false;
                }
            }
            if (allCompleted) {
                taskFlow.Status = 'Completed';
                return false;
            }
            else{
                taskFlow.Status = 'Waiting';
            }
        }
        return true;
    };



    function renderTemplate(obj: any, variables: { [key: string]: string }): any {
        if (typeof obj === "string") {
            return obj.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] ?? `{{${key.trim()}}}`);
        } else if (Array.isArray(obj)) {
            return obj.map(item => renderTemplate(item, variables));
        } else if (typeof obj === "object" && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [k, renderTemplate(v, variables)])
            );
        }
        return obj;
    }

    function convertTaskIds(task: Task): Task {
        const idMap: { [key: string]: string } = {};

        const generateUniqueId = (originalId: string): string => {
            if(originalId === 'null'){return 'null';}
            if (!idMap[originalId]) {
                idMap[originalId] = uuidv4();
            }
            return idMap[originalId];
        };

        const convertTask = (task: Task): Task => {
            const newTask = { ...task };
            newTask.TaskID = generateUniqueId(task.TaskID);
            if (newTask.Dependenceis) {
                newTask.Dependenceis = newTask.Dependenceis.split(',')
                    .map(dep => generateUniqueId(dep))
                    .join(',');
            }
            if (newTask.ToDo && newTask.ToDo.Data && newTask.ToDo.Data.Target) {
                if (Array.isArray(newTask.ToDo.Data.Target)) {
                    newTask.ToDo.Data.Target = newTask.ToDo.Data.Target.map((target: string) => generateUniqueId(target));
                } else {
                    newTask.ToDo.Data.Target = generateUniqueId(newTask.ToDo.Data.Target);
                }
            }
            if (newTask.Check && newTask.Check.Data && newTask.Check.Data.Target) {
                if (Array.isArray(newTask.Check.Data.Target)) {
                    newTask.Check.Data.Target = newTask.Check.Data.Target.map((target: string) => generateUniqueId(target));
                } else {
                    newTask.Check.Data.Target = generateUniqueId(newTask.Check.Data.Target);
                }
            }
            if (newTask.Flow) {
                newTask.Flow = newTask.Flow.map(convertTask);
            }
            return newTask;
        };

        return convertTask(task);
    }
    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        TaskScheduler,
        renderTemplate,
        findTaskById,
        sleep,
        replaceTaskById,
        convertTaskIds
    };
};