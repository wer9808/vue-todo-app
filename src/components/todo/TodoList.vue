<script setup>
import { ref, computed } from "vue";
import TodoListItem from "./TodoListItem.vue";

const emit = defineEmits([
  "toggle-todo-complete",
  "delete-todo",
  "edit-todo",
  "select-todo",
  "select-multi-todos",
  "complete-selected-todos",
  "delete-selected-todos",
]);

const { items, selectedItems } = defineProps(["items", "selectedItems"]);

const canMultiComplete = computed(() => selectedItems.length > 0);
const canMultiDelete = computed(() => selectedItems.length > 0);
const allSelected = () => {
  const anyUnselected = items.find((item) => item.selected === false);
  return !anyUnselected;
};
const castEvent = (eventName) => {
  return (...args) => {
    emit(eventName, ...args);
  };
};

const handleToggleTodoComplete = castEvent("toggle-todo-complete");
const handleDeleteTodo = castEvent("delete-todo");
const handleEditTodo = castEvent("edit-todo");
const handleSelectTodo = castEvent("select-todo");
const handleMultiComplete = castEvent("complete-selected-todos");
const handleMultiDelete = castEvent("delete-selected-todos");
const handleSelectAll = () => {
  const todoIds = items.map((todo) => todo.id);
  emit("select-multi-todos", todoIds, !allSelected());
};
</script>

<template>
  <div class="todo-list">
    <div class="todo-list-control">
      <button @click="handleSelectAll">전체 선택</button>
      <button :disabled="!canMultiComplete" @click="handleMultiComplete">
        완료
      </button>
      <button
        class="multi-delete-btn"
        :disabled="!canMultiDelete"
        @click="handleMultiDelete"
      >
        삭제
      </button>
    </div>
    <div class="todo-list-header todo-list-item">
      <div class="todo-list-item-column">선택</div>
      <div class="todo-list-item-column">할일</div>
      <div class="todo-list-item-column">진행상태</div>
      <div class="todo-list-item-column">종료일</div>
      <div class="todo-list-item-column">수정 / 삭제</div>
    </div>
    <div class="todo-list-items" v-if="items.length > 0">
      <TodoListItem
        v-for="(item, idx) in items"
        :key="item.id"
        :todo="item"
        @toggle-todo-complete="handleToggleTodoComplete"
        @delete-todo="handleDeleteTodo"
        @edit-todo="handleEditTodo"
        @select-todo="handleSelectTodo"
      />
    </div>
    <!-- 할 일 목록이 없을 때 -->
    <div class="todo-list-no-item" v-else>
      <p>할일 목록이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 8px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 4px;

  box-shadow: 1px 1px 2px lightgray;
}

.todo-list-header {
  background-color: white;
  margin: 8px;
  border: 1px solid lightgray;
  padding: 0 8px;
  border-radius: 8px;
  flex: 0 0 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  box-shadow: 1px 1px 2px lightgray;
}

.todo-list-item > * {
  text-align: center;
}

.todo-list-item-column:nth-child(1) {
  flex: 0 0 100px;
}
.todo-list-item-column:nth-child(2) {
  flex: 1 1 200px;
}
.todo-list-item-column:nth-child(3) {
  flex: 0 0 80px;
}
.todo-list-item-column:nth-child(4) {
  flex: 0 0 200px;
}
.todo-list-item-column:nth-child(5) {
  flex: 0 0 160px;
}

.todo-list-control {
  flex: 0 0 32px;
  margin: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 4px;
}

.todo-list-control > button {
  color: dodgerblue;
  background: none;
  border: 0;
  padding: 0 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.todo-list-control > .multi-delete-btn {
  color: crimson;
}

.todo-list-control > button:disabled {
  color: lightslategray;
  cursor: not-allowed;
}

.todo-list-items {
  overflow: scroll;
  flex: 1 1 400px;
}

.todo-list-no-item {
  flex: 1 1 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
