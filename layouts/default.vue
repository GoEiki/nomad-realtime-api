<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <nav>
      <ul>
        <li><NuxtLink to="/">UserUI</NuxtLink></li>
        <li><NuxtLink to="/ConsoleUI">ConsoleUI</NuxtLink></li>
        <li><NuxtLink to="/StateManager">StateManager</NuxtLink></li>
      </ul>
    </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script>
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
</style>
