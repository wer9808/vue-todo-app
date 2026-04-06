<script setup>
import { computed, useTemplateRef, watchEffect } from "vue";
import TodoListItem from "./TodoListItem.vue";
import { useTodoContainer } from "@/components/todo/useTodoContainer";
import { useTodoStore } from "@/stores/TodoStore";

const containerState = useTodoContainer();
const todoStore = useTodoStore();
const items = containerState.displayItems;

const selectionList = containerState.selectionList;
const selectedItems = selectionList.items;

const canMultiChange = computed(() => selectedItems.value.length > 0);
const canMultiDelete = computed(() => selectedItems.value.length > 0);
const allSelected = () => {
  return items.value.length === selectedItems.value.length;
};

const progressSelect = useTemplateRef("todo-progress-select");

watchEffect(() => {
  if (progressSelect.value) {
    if (canMultiChange.value === true) {
      progressSelect.value.disabled = false;
    } else {
      progressSelect.value.disabled = true;
      progressSelect.value.value = "";
    }
  }
});

const isSelected = (todo) => {
  return selectionList.find(todo) ? true : false;
};

const handleSelectItem = (todoId) => {
  const todo = todoStore.find(todoId);
  if (todo) {
    selectionList.toggle(todo);
  }
};

const handleDeleteItem = (todoId) => {
  todoStore.delete(todoId);
};

const handleUpdateItem = (todoId, update) => {
  todoStore.update(todoId, update);
};

const handleSelectAll = () => {
  if (allSelected()) {
    selectionList.clear();
  } else {
    selectionList.set([...items.value]);
  }
};

const handleMultiDelete = () => {
  selectedItems.value.forEach((item) => {
    todoStore.delete(item.id);
  });
};

const handleMultiProgressChange = ($e) => {
  const progress = $e.target.value;
  selectedItems.value.forEach((item) => {
    todoStore.update(item.id, { progress });
  });
};
</script>

<template>
  <div
    class="flex w-full flex-col justify-start items-center gap-4 bg-white m-2 p-4 border-1 border-gray-100 rounded-xl shadow-md shadow-gray-300"
  >
    <div class="flex w-full flex-row flex-initial gap-2">
      <button
        class="flex-none basis text-blue-500 text-sm md:text-base cursor-pointer"
        @click="handleSelectAll"
      >
        전체 선택
      </button>
      <select
        class="flex-none w-24 text-blue-500 text-sm md:text-base text-end cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
        ref="todo-progress-select"
        @change="handleMultiProgressChange"
      >
        <option value="" selected disabled hidden>진행상태</option>
        <option value="wait">대기</option>
        <option value="ongoing">진행중</option>
        <option value="completed">완료</option>
      </select>
      <button
        class="flex-none w-16 text-red-500 text-sm md:text-base cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
        :disabled="!canMultiDelete"
        @click="handleMultiDelete"
      >
        삭제
      </button>
    </div>
    <div
      class="flex flex-1 w-full basis-md flex-col justify-start items-start md:items-center overflow-scroll"
    >
      <div
        class="flex min-w-2xl w-full flex-row justify-between items-center gap-2 mb-2 p-2 border-1 border-gray-200 rounded-md"
      >
        <div class="grow-1 text-center basis-16">선택</div>
        <div class="grow-2 text-center basis-16">할일</div>
        <div class="grow-1 text-center basis-16">라벨</div>
        <div class="grow-1 text-center basis-16">진행상태</div>
        <div class="grow-2 text-center basis-16">종료일</div>
        <div class="grow-1 text-center basis-16">수정 / 삭제</div>
      </div>
      <TodoListItem
        v-for="(item, idx) in items"
        :key="item.id"
        :todo="item"
        :selected="isSelected(item)"
        @select-item="handleSelectItem"
        @delete-item="handleDeleteItem"
        @update-item="handleUpdateItem"
      />
    </div>
    <!-- 할 일 목록이 없을 때 -->
  </div>
</template>

<style scoped></style>
