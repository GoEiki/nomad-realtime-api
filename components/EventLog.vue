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
    <div v-for="(event, index) in realtimestore.realtimeEvents" :key="index" class="conversation-item">
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
.content-block-body {
  background-color: #ffffff;
  padding: 20px;
  max-height: 100px;
  border-radius: 8px;
  overflow-y: auto;
  color: black;
}
</style>