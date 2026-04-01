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
  <div
    class="flex flex-none h-24 min-w-2xl w-full flex-row justify-between items-center gap-2 p-2 border-1 border-gray-200 rounded-md"
  >
    <div
      class="flex flex-row justify-center items-center grow-1 basis-16 text-center"
    >
      <input
        type="checkbox"
        :id="`chk-${todo.id}`"
        :checked="selected"
        @input="handleSelectTodo"
      />
      <label :for="`chk-${todo.id}`"></label>
    </div>
    <div class="grow-2 basis-16 text-center text-ellipsis overflow-hidden">
      {{ todo.title }}
    </div>
    <div
      class="flex h-full flex-row flex-wrap justify-start items-start gap-2 grow-1 basis-16 overflow-x-hidden overflow-y-scroll"
    >
      <div
        class="bg-yellow-400 text-xs text-center text-nowrap text-ellipsis px-3 py-1 rounded-full overflow-hidden"
        v-for="label in todo.labels"
      >
        {{ label }}
      </div>
    </div>
    <div class="flex flex-col justify-center grow-1 basis-16 text-center">
      <span class="material-symbols-rounded" :class="todo.progress">
        {{ progressIcon }}
      </span>
    </div>
    <div class="grow-2 basis-16 text-center">
      {{ untilDateString }}
    </div>
    <div
      class="flex flex-row justify-center items-center grow-1 basis-16 text-center"
    >
      <span class="material-symbols-outlined" @click="toggleTodoProgress"
        >check</span
      >
      <span class="material-symbols-outlined" @click="handleStartEdit"
        >edit</span
      >
      <span class="material-symbols-outlined" @click="deleteTodo">
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

<style scoped></style>
