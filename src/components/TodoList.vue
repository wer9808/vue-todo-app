<script setup>
import { ref } from "vue";
import TodoListItem from "./TodoListItem.vue";

const emit = defineEmits([
  "toggle-todo-complete",
  "delete-todo",
  "edit-todo",
  "select-todo",
]);

const { items } = defineProps(["items"]);

const castEvent = (eventName) => {
  return (...args) => {
    emit(eventName, ...args);
  };
};

const handleToggleTodoComplete = castEvent("toggle-todo-complete");
const handleDeleteTodo = castEvent("delete-todo");
const handleEditTodo = castEvent("edit-todo");
const handleSelectTodo = castEvent("select-todo");
</script>

<template>
  <div class="todo-list">
    <!-- 할 일 목록이 있을 때 (완료 시 .todo__item--completed 클래스 추가 )-->
    <div class="todo-list-header todo-list-item">
      <div class="todo-list-item-column">완료</div>
      <div class="todo-list-item-column">할일</div>
      <div class="todo-list-item-column">진행상태</div>
      <div class="todo-list-item-column">종료일</div>
      <div class="todo-list-item-column">수정/삭제</div>
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
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 4px;
}

.todo-list-items {
  flex: 1 1 auto;
}

.todo-list-header {
  background-color: white;
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
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

.todo-list-no-item {
  flex: 1 1 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
