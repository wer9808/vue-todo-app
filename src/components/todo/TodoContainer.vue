<script setup>
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
</script>

<template>
  <div class="w-full flex flex-col justify-start items-center gap-1 p-4">
    <TodoHeader />
    <TodoList />
    <TodoInput />
  </div>
</template>

<style scoped></style>
