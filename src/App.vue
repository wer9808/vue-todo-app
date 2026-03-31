<script setup>
import TodoContainer from "./components/todo/TodoContainer.vue";
</script>

<template>
  <div class="container">
    <TodoContainer />
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

@media screen and (min-width: 1280px) and (max-width: 1920px) {
  .container {
    width: 1080px;
  }
}

@media screen and (max-width: 1279px) {
  .container {
    min-width: 800px;
    max-width: 1080px;
  }
}
</style>
