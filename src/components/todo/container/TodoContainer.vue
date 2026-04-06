<script setup>
import TodoContainerHeader from "./TodoContainerHeader.vue";
import TodoContainerListView from "./TodoContainerListView.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
</script>

<template>
  <div class="w-full flex flex-col justify-start items-center gap-1 p-4">
    <TodoContainerHeader />
    <TodoContainerListView />
    <TodoInput />
  </div>
</template>

<style scoped></style>
