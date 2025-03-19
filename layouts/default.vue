<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <nav>
      <ul>
        <li><NuxtLink to="/">UserUI</NuxtLink></li>
        <li><NuxtLink to="/ConsoleUI">ConsoleUI</NuxtLink></li>
        <li><NuxtLink to="/StateManager">StateManager</NuxtLink></li>
        <li><NuxtLink to="/MultiConversation">MultiConversation</NuxtLink></li>
      </ul>
    </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p :class="{ active: isTabActive, inactive: !isTabActive }">
        {{ isTabActive ? 'ACTIVE' : 'INACTIVE' }}
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTabActive: true, // タブがアクティブかどうかを管理
    };
  },
  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange() {
      this.isTabActive = document.visibilityState === 'visible';
    },
  },
};
</script>

<style scoped>
/* レイアウトのスタイル */
header {
  background-color: #f5f5f5;
  padding: 10px;
}
nav ul {
  display: flex;
  list-style: none;
  gap: 15px;
  padding: 0;
}
nav li {
  margin: 0;
}
footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: gray;
}
footer p.active {
  color: green;
  font-weight: bold;
}
footer p.inactive {
  color: red;
  font-weight: bold;
}
</style>
