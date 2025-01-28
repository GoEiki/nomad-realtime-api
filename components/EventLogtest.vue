<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
const messageLogRef = ref<HTMLElement>();
const realtimestore = RealtimeStore(); // Pinia ストアを取得
onMounted(() => {
  watch(
    () => realtimestore.realtimeEvents,
    () => {
      if (messageLogRef.value) {
        messageLogRef.value.scrollTop = messageLogRef.value.scrollHeight;
      }
    },
    { deep: true }
  );
  }
);
</script>
<template>
    <div class="content-block-body" data-conversation-content ref="messageLogRef">
    <!-- 会話がない場合 -->
    <div v-if="!realtimestore.realtimeEvents.length">awaiting connection...</div>

    <!-- 会話リスト -->
    <div
        v-for="(event, index) in realtimestore.realtimeEvents"
        :key="index"
        class="conversation-item"
    >
        <div :class="['speaker', event.source || '']">
        <div>
            {{ event.source }} : {{ event.event['type'] }}
        </div>
        <div v-if="event.count"> {{ event.count }}</div>
        </div>
    </div>
    </div>

  </template>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.content-block-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content-block-body {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
  color:black;
}

.conversation-item {
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.speaker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color : #000000;
}
</style>