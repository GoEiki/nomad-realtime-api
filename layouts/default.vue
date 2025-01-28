<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <nav>
      <ul>
        <li><NuxtLink to="/">UserUITest</NuxtLink></li>
        <li><NuxtLink to="/ConsoleUItest">ConsoleUITest</NuxtLink></li>
      </ul>
    </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p>フッター</p>
    </footer>
  </div>
</template>

<script>
export default {
  // レイアウトのロジック
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
</style>
