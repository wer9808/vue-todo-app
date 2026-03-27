<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { computed, ref } from "vue";
import TodoEditModal from "./TodoEditModal.vue";

const emit = defineEmits(["toggle-todo-complete", "delete-todo", "edit-todo"]);
const { todo } = defineProps({
  todo: {
    id: Number,
    content: String,
    completed: Boolean,
  },
});

const modifying = ref(false);

const untilDateString = computed(() => {
  const until = todo.until;
  const year = until.getFullYear().toString();
  const month = (until.getMonth() + 1).toString();
  const day = DateUtil.getDayString(until);
  const hour = until.getHours().toString();
  const ampm = DateUtil.getAmPmString(until);
  const minute = DateUtil.getMinuteString(until);

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute} ${ampm}`;
});

const toggleTodoComplete = () => {
  emit("toggle-todo-complete", todo.id);
};

const deleteTodo = () => {
  emit("delete-todo", todo.id);
};

const handleStartEdit = () => {
  if (!modifying.value) {
    if (todo.completed) return;
    modifying.value = true;
  }
};

const handleEndEdit = (update) => {
  emit("edit-todo", todo.id, update);
  modifying.value = false;
};

const handleCancelEdit = () => {
  modifying.value = false;
};
</script>

<template>
  <div class="todo__item todo-list-item">
    <div class="todo-list-item-check todo-list-item-column">
      <input
        type="checkbox"
        :id="`chk-${todo.id}`"
        :checked="todo.completed"
        @input="toggleTodoComplete"
      />
      <label
        :for="`chk-${todo.id}`"
        class="todo-list-item-checkbox-label"
      ></label>
    </div>
    <div class="todo-list-item-content todo-list-item-column">
      <div class="todo-list-item-text">
        {{ todo.content }}
      </div>
    </div>
    <div class="todo-list-item-state todo-list-item-column">
      <span
        class="material-symbols-rounded"
        :class="todo.completed ? `completed` : `incompleted`"
      >
        {{ todo.completed ? "done_outline" : "hourglass_bottom" }}
      </span>
    </div>
    <span class="todo-list-item-until todo-list-item-column">{{
      untilDateString
    }}</span>
    <div class="todo-list-item-control todo-list-item-column">
      <span class="material-symbols-outlined edit-icon" @click="handleStartEdit"
        >edit</span
      >
      <span class="material-symbols-outlined delete-icon" @click="deleteTodo">
        delete
      </span>
    </div>
  </div>
  <teleport to="body">
    <TodoEditModal
      :todo="todo"
      v-if="modifying"
      @end-edit="handleEndEdit"
      @cancel-edit="handleCancelEdit"
    />
  </teleport>
</template>

<style scoped>
.todo-list-item {
  background-color: white;
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 12px 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.todo-list-item:hover {
  background-color: ghostwhite;
  padding: 13px 8px;
  box-shadow: 1px 2px 3px gray;
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
  flex: 0 0 100px;
}
.todo-list-item-column:nth-child(4) {
  flex: 0 0 200px;
}
.todo-list-item-column:nth-child(5) {
  flex: 0 0 100px;
}

.todo-list-item-content {
  overflow: hidden;
}

.todo-list-item-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-list-item-state {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.todo-list-item-state > .completed {
  color: limegreen;
}

.todo-list-item-state > .incompleted {
  color: sandybrown;
}

.todo-list-item-control {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 8px;
}

.todo-list-item-control > * {
  cursor: pointer;
}

.todo-list-item-control > .edit-icon {
  color: royalblue;
}

.todo-list-item-control > .delete-icon {
  color: crimson;
  padding-right: 16px;
}
</style>
