<template>
  <div class="flow-container">
    <vue-flow :nodes="nodes" :edges="edges" :node-types="nodeTypes" @nodeClick="onNodeClick" />
    <Controls  :show-zoom="false" :show-fit-view="false" :show-interactive="false">
      <ControlButton title="Reset Transform" @click="resetTransform">
        <Icon name="reset" />
      </ControlButton>
      <ControlButton title="Back Transform" @click="onBackClick">
        <Icon name="back" />
      </ControlButton>


    </Controls>
  </div>
</template>

<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
import { VueFlow } from "@vue-flow/core";
import { useVueFlow } from "@vue-flow/core";
import { Controls } from "@vue-flow/controls";
import { ControlButton } from "@vue-flow/controls";
import type { Node, Edge } from "@vue-flow/core";
import '@vue-flow/core/dist/style.css';
import CustomNode from '@/components/CustomNode.vue';
import { ref, watch, onMounted, markRaw } from 'vue';
//import type { Task } from '@/types/Task'; // Task 型をインポート
const previousTaskID = ref<string[]>([]);
const previousTask = ref<Task[]>([]);
const currentTask = ref<Task | undefined>(undefined);
const taskFlowStack = ref<{ nodes: Node[], edges: Edge[] }[]>([]); // スタックで状態を保持
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
import type { NodeComponent } from "@vue-flow/core";
const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject } = useVueFlow()
const nodeTypes: Record<string, NodeComponent> = {
  custom: markRaw(CustomNode) as NodeComponent
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
function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

onMounted(() => {
  watch(
    () => realtimestore.NomadEvents,
    (newEvents) => {
      if (newEvents.length > 0) {
        const latestEvent = newEvents[newEvents.length - 1];
        console.log(latestEvent);
        if (latestEvent.event['event'] === 'state.event') {
          currentTask.value = latestEvent.event['data'];
          nodes.value = [];
          edges.value = [];
          if (currentTask.value && findTaskById(currentTask.value, previousTaskID.value[previousTaskID.value.length - 1])) {
            const task = findTaskById(currentTask.value, previousTaskID.value[previousTaskID.value.length - 1]);
            parseTaskFlow(task);
          }
          else {
            parseTaskFlow(latestEvent.event['data']);
            previousTaskID.value = [];
            previousTaskID.value.push(latestEvent.event['data'].TaskID);
            /*
            previousTask.value=[];
            previousTask.value.push(latestEvent.event['data']);
            */
          }

        }
      }
    },
    { deep: true }
  );
});

const onNodeClick = (node: any) => {
  console.log('node clicked', node.node.data);
  if (node.node.data.Flow) {
    //taskFlowStack.value.push({ nodes: [...nodes.value], edges: [...edges.value] });
    nodes.value = [];
    edges.value = [];
    parseTaskFlow(node.node.data);
    previousTask.value.push(node.node.data);
    previousTaskID.value.push(node.node.data.TaskID);
  }
};

const onBackClick = () => {
  console.log('back clicked');
  /*
  if(previousTask.value.length-1>0){
      previousTask.value.pop();
      console.log(previousTask.value[previousTask.value.length-1]);
      nodes.value = [];
      edges.value = [];
      parseTaskFlow(previousTask.value[previousTask.value.length-1]);
      
  }
  */
  if (previousTaskID.value.length - 1 > 0) {
    previousTaskID.value.pop();
    console.log(previousTaskID.value[previousTaskID.value.length - 1]);
    nodes.value = [];
    edges.value = [];
    const task = currentTask.value ? findTaskById(currentTask.value, previousTaskID.value[previousTaskID.value.length - 1]) : null;

    parseTaskFlow(task);

  }
};

const parseTaskFlow = (taskFlow: any) => {
  if (!taskFlow) { console.error('taskFlow is null'); return; }
  const { Flow } = taskFlow;
  if (Flow) {
    Flow.forEach((task: any, index: number) => {
      const yPosition = 100 + index * 200;
      nodes.value.push({
        id: task.TaskID,
        position: { x: 100, y: yPosition },
        class: `status-${task.Status.toLowerCase()}`,
        data: task,
        type: 'custom', // CustomNodeを使用

      });
      if (task.Dependenceis && task.Dependenceis !== 'null') {
        edges.value.push({
          id: `${task.Dependenceis}-${task.TaskID}`,
          source: task.Dependenceis,
          target: task.TaskID
        });
      }
    });
  }
};
</script>

<style scoped>
.flow-container {
  width: 100%;
  height: 100%;
  /* 適切な高さを設定 */
}

.node-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
}

.status-waiting {
  background-color: #f4a261;
}

.status-inprogress {
  background-color: #2a9d8f;
}

.status-complete {
  background-color: #e76f51;
}

.control-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.control-button:hover {
  background-color: #0056b3;
}



</style>