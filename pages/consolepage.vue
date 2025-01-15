<template>
    <div class="voice-interaction-container">
      <Chatlog />
      <Eventlog />
      <AudioVisualizer />
      <Console />
    </div>
</template>
  
<script>

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
