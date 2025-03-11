<script setup lang="ts">
import { RealtimeStore } from '@/stores/APIClientStore';
const conversationLogRef = ref<HTMLElement>();
const realtimestore = RealtimeStore(); // Pinia ストアを取得
onMounted(() => {
  watch(
    () => realtimestore.realtimeEvents,
    () => {
      if (conversationLogRef.value) {
        conversationLogRef.value.scrollTop = conversationLogRef.value.scrollHeight;
      }
    },
    { deep: true }
  );
  }
);
</script>

<template>
  <div>
      
      <div class="content-block-body" data-conversation-content ref="conversationLogRef">
        <!-- 会話がない場合 -->
        <div v-if="!realtimestore.items.length">awaiting connection...</div>

        <!-- 会話リスト -->
        <div
          v-for="conversationItem in realtimestore.items"
          :key="conversationItem.id"
          class="conversation-item"
        >
          <div :class="['speaker', conversationItem.role || '']">
            <div>
              {{ (conversationItem.role || conversationItem.type).replaceAll('_', ' ') }}
            </div>
          </div>

          <div class="speaker-content">
            <!-- tool response -->
            <div v-if="conversationItem.type === 'function_call_output'">
              {{ conversationItem.formatted.output }}
            </div>

            <!-- tool call -->
            <div v-if="conversationItem.formatted.tool">
              {{ conversationItem.formatted.tool.name }}(
              {{ conversationItem.formatted.tool.arguments }})
            </div>

            <!-- user message -->
            <div
              v-if="!conversationItem.formatted.tool && conversationItem.role === 'user'"
            >
              {{ conversationItem.formatted.transcript ||
                (conversationItem.formatted.audio?.length
                  ? '(awaiting transcript)'
                  : conversationItem.formatted.text || '(item sent)') }}
            </div>

            <!-- assistant response -->
            <div
              v-if="!conversationItem.formatted.tool && conversationItem.role === 'assistant'"
            >
              {{ conversationItem.formatted.transcript ||
                conversationItem.formatted.text || '(truncated)' }}
            </div>

            <!-- audio file -->
            <audio
              v-if="conversationItem.formatted.file"
              :src="conversationItem.formatted.file.url"
              controls
            ></audio>
          </div>
        </div>
      </div>
    </div>


</template>

<style scoped>
.content-block-body {
  background-color: #ffffff;
  padding: 20px;
  max-height: 350px;
  border-radius: 8px;
  overflow-y: auto;
  color: black;
}
.speaker.user {
  color: #007bff;
}

.speaker.assistant {
  color: #28a745;
}

.role {
  font-size: 1rem;
}

.close {
  cursor: pointer;
  color: #d9534f;
  font-size: 1.2rem;
}

.speaker-content {
  padding-left: 1rem;
  color: #555;
  font-size: 0.9rem;
}

.tool-output {
  color: #6c757d;
}

.tool-call {
  color: #ffc107;
}

.user-message {
  color: #0056b3;
}

.assistant-response {
  color: #155724;
}

audio {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
