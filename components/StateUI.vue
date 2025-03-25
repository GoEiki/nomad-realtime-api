<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
interface ParsedStatus {
  instructions: string;
  voice: string;
  input_audio_transcription: { model: string } | null;
  turn_detection: { type: string } ;
  tool_choice: string;
  temperature: number;
  max_response_output_tokens: number;
}
const realtimestore = RealtimeStore(); // Pinia ストアを取得
const showMessageBox = ref(false);
const currentMessage = ref('');
const parsedStatus = ref<ParsedStatus>({
  instructions: "awaiting connection...",
  voice: "awaiting connection...",
  input_audio_transcription: null,
  turn_detection: {type:'semantic_vad'},
  tool_choice: "awaiting connection...",
  temperature: 0.0,
  max_response_output_tokens: 0
});
const confirmMessage = () => {
  showMessageBox.value = false;
  currentMessage.value = '';
  realtimestore.sendEvent("message.event", { message: "confirm" });
};

const selectedTask = ref('');

const taskOptions = ref([
  { label: 'タスクを選択', value: '', data: {} },
]);

const confirmTask = () => {
  const selectedTaskOption = taskOptions.value.find(task => task.value === selectedTask.value);
  const taskData = selectedTaskOption ? selectedTaskOption.data : {};
  realtimestore.client?.sendNomadEvent({ event: selectedTask.value, data: taskData });
  selectedTask.value = '';
};
const vadType = ref('server_vad');

const changeVadType = (type: string) => {
  vadType.value = type;
  console.log(`changevadtype ${type}`);
  realtimestore.client?.sendNomadEvent({ event: 'control.event', data: { Method: 'ChangeTurnEndType', Data: { value: type } } });
};
function reload() {
  realtimestore.client?.sendNomadEvent({ event: 'control.event', data: { Method: 'ReloadBasicTasks', Data: {} } });
}

onMounted(() => {
  watch(
    () => realtimestore.NomadEvents,
    (newEvents) => {
      if (newEvents.length > 0) {
        const latestEvent = newEvents[newEvents.length - 1];
        console.log(latestEvent);
        if (latestEvent.event.event === 'notify.event') {
          currentMessage.value = latestEvent.event.data.message;
          showMessageBox.value = true;
        }
        if (latestEvent.event.event === 'log.event') {
          if (latestEvent.event.data.status) {
            parsedStatus.value.instructions = latestEvent.event.data.status.instructions;
            parsedStatus.value.voice = latestEvent.event.data.status.voice;
            parsedStatus.value.input_audio_transcription = latestEvent.event.data.status.input_audio_transcription;
            parsedStatus.value.turn_detection = latestEvent.event.data.status.turn_detection;
            parsedStatus.value.tool_choice = latestEvent.event.data.status.tool_choice;
            parsedStatus.value.temperature = latestEvent.event.data.status.temperature;
            parsedStatus.value.max_response_output_tokens = latestEvent.event.data.status.max_response_output_tokens;
            console.log(parsedStatus.value);
          }
          if (latestEvent.event.data.basictasks) {
            taskOptions.value = [{ label: 'タスクを選択', value: '', data: {} }];
            for (const key of Object.keys(latestEvent.event.data.basictasks)) {

              const task = latestEvent.event.data.basictasks[key];
              if (task.Hidden) { }
              else { taskOptions.value.push({ label: task.Alias, value: task.TaskID, data: {} }); }

            }
          }



        }
      }
    },
    { deep: true }
  );
});
</script>
<template>
  <!-- メッセージボックス -->
  <div v-if="showMessageBox" class="message-box">
    <div class="message-box-content">
      <p>{{ currentMessage }}</p>
      <button @click="confirmMessage">確認</button>
    </div>
  </div>
  <!-- タスクキュー -->
  <div class="status-display">
    <div class="task-queue-inline">
      <select v-model="selectedTask">
        <option v-for="(task, index) in taskOptions" :key="index" :value="task.value" :data="task.data">
          {{ task.label }}
        </option>
      </select>
      <button @click="confirmTask" :disabled="!selectedTask">送信</button>
      <button @click="reload">
        <Icon name="reset" />
      </button>
    </div>
  </div>
  <!-- ステータス表示 -->
  <div class="status-display">
    <div v-if="parsedStatus">
      <div class="swipe-selector">
        <div :class="['swipe-option', { active: parsedStatus.turn_detection.type === 'semantic_vad' }]" @click="changeVadType('none')">
          SEMANTIC VAD </div>
        <div
          :class="['swipe-option', { active: parsedStatus.turn_detection.type === 'server_vad' }]"
          @click="changeVadType('server_vad')">SERVER VAD</div>
      </div>
      <h3>Instructions</h3>
      <p>{{ parsedStatus.instructions }}</p>

      <div class="status-table">
        <div class="status-row">
          <span class="status-label">Voice:</span>
          <span class="status-value">{{ parsedStatus.voice }}</span>
        </div>
        <div class="status-row">
          <span class="status-label">Transcription Model:</span>
          <span class="status-value">{{ parsedStatus.input_audio_transcription?.model }}</span>
        </div>
        <div class="status-row">
          <span class="status-label">Tool Choice:</span>
          <span class="status-value">{{ parsedStatus.tool_choice }}</span>
        </div>
        <div class="status-row">
          <span class="status-label">Temperature:</span>
          <span class="status-value">{{ parsedStatus.temperature }}</span>
        </div>
        <div class="status-row">
          <span class="status-label">Max Response Output Tokens:</span>
          <span class="status-value">{{ parsedStatus.max_response_output_tokens }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-display {
  text-align: center;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 20px;
  color: black;
}

.message-box {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: black;
  width: 300px;
  text-align: center;
}

.message-box-content {
  padding: 20px;
}

.message-box p {
  margin-bottom: 20px;
}

.message-box button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-box button:hover {
  background-color: #0056b3;
}

.swipe-selector {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.swipe-option {
  padding: 10px 20px;
  background-color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.swipe-option.active {
  background-color: #007bff;
  color: white;
}

.swipe-option:hover {
  background-color: #0056b3;
  color: white;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;

}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
  color: white;
}

button:active:not(:disabled) {
  background-color: #007bff;
  color: white;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status-label {
  font-weight: bold;
}

.status-value {
  font-style: italic;
}

.status-table {
  text-align: left;
  display: table;
  width: 100%;
  margin-top: 20px;
}

.status-row {
  display: table-row;
}

.status-label,
.status-value {
  display: table-cell;
  padding: 10px;
  border: 1px solid #ddd;
}

.status-label {
  font-weight: bold;
}

.status-value {
  font-style: italic;
}

select {
  width: 200px;
  /* 固定の幅を設定 */
  overflow: hidden;
  /* 内容が溢れた場合に隠す */
  text-overflow: ellipsis;
  /* 溢れた内容を省略記号で表示 */
  white-space: nowrap;
  /* 内容を一行にする */
}
</style>