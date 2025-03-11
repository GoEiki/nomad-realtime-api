<!-- CustomNode.vue -->
<template>
  <div class="custom-node" :style="nodeStyle" @mouseover="showDetails" @mouseleave="hideDetails">
    <div class="node-details">
      <div class="detail-item type-logo">{{ data.Type }}</div>
      <div class="detail-item">{{ data.Alias }}</div>
      <!-- TaskIDとStatusの表示を削除 -->
    </div>
    <div v-if="hovered" class="additional-info">
      <div class="detail-item"><strong>TaskID:</strong> {{ data.TaskID }}</div>
      <div class="detail-item"><strong>ToDo:</strong> {{ data.ToDo }}</div>
      <div class="detail-item"><strong>Check:</strong> {{ data.Check }}</div>
    </div>
    <button @click.stop="executeCustomFunction(data.TaskID)">ToggleStatus</button>
  </div>
</template>

<script>
import { RealtimeStore } from '@/stores/APIClientStore';

export default defineComponent({
  props: ['data', 'id', 'selected'],
  data() {
    return {
      hovered: false
    }
  },
  setup() {
    const realtimestore = RealtimeStore(); // Pinia ストアを取得
    return { realtimestore }
  },
  computed: {
    label() {
      return this.data.Alias || 'No Label'
    },
    nodeStyle() {
      let borderColor;
      let borderStyle = 'solid';
      if (this.data.Status === 'Completed') {
        borderColor = '#66bb6a'; // Green
      } else if (this.data.Status === 'Waiting') {
        borderColor = '#b0bec5'; // Gray
      }
      if (this.data.Type === 'TaskFlow') {
        borderStyle = 'double'; // Double border for TaskFlow
      }
      

      return {
        padding: '15px',
        background: '#ffffff', // White background
        borderRadius: '10px',
        border: `7px ${borderStyle} ${borderColor}`, // Dynamic border style
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  methods: {
    onClick() {
      alert(`Node ${this.label} clicked!`)
    },
    showDetails() {
      this.hovered = true;
    },
    hideDetails() {
      this.hovered = false;
    },
    executeCustomFunction(taskid) {
      const client = this.realtimestore.client;
      if (client) {
        client.sendNomadEvent({ event: 'control.event', data: { Method: 'ForcelyToggleTaskStatus', Data: {TaskID:taskid} } });
      }
    }
  }
})
</script>

<style scoped>
.custom-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  color: rgb(69, 69, 69);
  position: relative;
  z-index: 1;
}

.node-details {
  margin-bottom: 15px;
  width: 100%;
}

.detail-item {
  margin-bottom: 5px;
  font-size: 14px;
}

.type-logo {
  font-size: 12px;
  font-weight: bold;
  color: #00796b;
}

button {
  padding: 8px 12px;
  cursor: pointer;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
}

button:hover {
  background-color: #004d40;
}

.additional-info {
  position: absolute;
  top: 0;
  left: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  box-sizing: border-box;
  z-index: 10;
}

.additional-info .detail-item {
  margin-bottom: 5px;
  font-size: 14px;
}
</style>
