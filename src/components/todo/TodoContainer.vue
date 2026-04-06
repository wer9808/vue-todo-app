<script setup>
import { watch } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { useTodoContainerStore } from "@/stores/TodoContainerStore";

const todoContainerStore = useTodoContainerStore();

// 필터 변경 시 선택 아이템 초기화
watch(todoContainerStore.displayItems, (current, old) => {
  if (current != old) {
    todoContainerStore.selectionList.clear();
  }
});

// 아이템 변화 시 표시 목록에서 사라진 선택 아이템 초기화
watch(todoContainerStore.displayItems, (current, old) => {
  if (current.length != old.length) {
    old.forEach((oldTodo) => {
      todoContainerStore.selectionList.unselect(oldTodo);
    });
  }
});
</script>

<template>
  <div class="w-full flex flex-col justify-start items-center gap-1 p-4">
    <TodoHeader />
    <TodoList />
    <TodoInput />
  </div>
</template>

<style scoped></style>
