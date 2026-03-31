<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { computed, ref } from "vue";
import TodoEditModal from "./TodoEditModal.vue";

const emit = defineEmits([
  "toggle-todo-progress",
  "delete-todo",
  "edit-todo",
  "select-todo",
]);

const { todo, selected } = defineProps({
  todo: {
    id: Number,
    title: String,
    progress: String,
  },
  selected: Boolean,
});

const modifying = ref(false);

const untilDateString = computed(() => {
  const until = todo.until;
  const year = until.getFullYear().toString();
  const month = (until.getMonth() + 1).toString();
  const day = until.getDate().toString();
  const hour = until.getHours().toString();
  const ampm = DateUtil.getAmPmString(until);
  const minute = DateUtil.getMinuteString(until);

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute} ${ampm}`;
});

const progressIcon = computed(() => {
  switch (todo.progress) {
    case "wait":
      return "snooze";
    case "ongoing":
      return "progress_activity";
    case "completed":
      return "check_circle";
    default:
      return "snooze";
  }
});

const toggleTodoProgress = () => {
  emit("toggle-todo-progress", todo.id);
};

const deleteTodo = () => {
  emit("delete-todo", todo.id);
};

const handleSelectTodo = () => {
  emit("select-todo", todo.id);
};

const handleStartEdit = () => {
  if (!modifying.value) {
    if (todo.progress === "completed") return;
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
  <div class="todo-list-item">
    <div class="todo-list-item-check todo-list-item-column">
      <input
        type="checkbox"
        :id="`chk-${todo.id}`"
        :checked="selected"
        @input="handleSelectTodo"
      />
      <label
        :for="`chk-${todo.id}`"
        class="todo-list-item-checkbox-label"
      ></label>
    </div>
    <div class="todo-list-item-title todo-list-item-column">
      <div class="todo-list-item-text">
        {{ todo.title }}
      </div>
    </div>
    <div class="todo-list-item-labels todo-list-item-column">
      <div class="todo-list-item-label" v-for="label in todo.labels">
        {{ label }}
      </div>
    </div>
    <div class="todo-list-item-state todo-list-item-column">
      <span class="material-symbols-rounded" :class="todo.progress">
        {{ progressIcon }}
      </span>
    </div>
    <span class="todo-list-item-until todo-list-item-column">{{
      untilDateString
    }}</span>
    <div class="todo-list-item-control todo-list-item-column">
      <span
        class="material-symbols-outlined toggle-progress-icon"
        @click="toggleTodoProgress"
        >check</span
      >
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
@import "@/assets/todo-container/TodoListItem.css";

.todo-list-item-title {
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

.todo-list-item-state > .wait {
  color: sandybrown;
}

.todo-list-item-state > .ongoing {
  color: royalblue;
}

.todo-list-item-state > .completed {
  color: limegreen;
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

.todo-list-item-control > .toggle-progress-icon {
  color: limegreen;
  padding: 4px;
}

.todo-list-item-control > .edit-icon {
  color: royalblue;
  padding: 4px;
}

.todo-list-item-control > .delete-icon {
  color: crimson;
  padding: 4px;
  padding-right: 16px;
}

.todo-list-item-labels {
  overflow: scroll;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  gap: 4px;
}

.todo-list-item-label {
  flex: 0 0 auto;
  color: white;
  background-color: dodgerblue;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 0.8rem;
}
</style>
