<template>
    <div class="voice-interaction-container">
      <MultiConversationClientUI />
        <ControlsforMultiConversation />
      
    </div>
</template>
  
<script>
import ControlsforMultiConversation from '~/components/ControlsforMultiConversation.vue';



export default {
  head() {
    return {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' } // スマホ対応
      ]
    }
  },
  components: {
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.voice-interaction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
