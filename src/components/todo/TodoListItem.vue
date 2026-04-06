<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { computed, reactive, ref } from "vue";
import TodoEditModal from "./TodoEditModal.vue";

const { todo, selected } = defineProps({
  todo: {
    id: Number,
    title: String,
    progress: String,
    until: Number,
    createdAt: Number,
    labels: Array,
  },
  selected: Boolean,
});

const emit = defineEmits(["select-item", "delete-item", "update-item"]);

const todoId = computed(() => todo.id);
const todoTitle = computed(() => todo.title);
const todoProgress = computed(() => todo.progress);
const todoUntil = computed(() => todo.until);
const todoLabels = computed(() => todo.labels);

const modifying = ref(false);

const untilDateString = computed(() => {
  const untilDate = new Date(todoUntil.value);
  const year = untilDate.getFullYear().toString();
  const month = (untilDate.getMonth() + 1).toString();
  const day = untilDate.getDate().toString();
  const hour = untilDate.getHours().toString();
  const ampm = DateUtil.getAmPmString(untilDate);
  const minute = DateUtil.getMinuteString(untilDate);

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute} ${ampm}`;
});

const progressIcon = computed(() => {
  switch (todoProgress.value) {
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

const handleToggleProgress = () => {
  let nextProgress = todoProgress.value;
  if (nextProgress === "wait") {
    nextProgress = "ongoing";
  } else if (nextProgress === "ongoing") {
    nextProgress = "completed";
  } else if (nextProgress === "completed") {
    nextProgress = "wait";
  }
  emit("update-item", todoId.value, { progress: nextProgress });
};

const handleDelete = () => {
  emit("delete-item", todoId.value);
};

const handleSelect = () => {
  emit("select-item", todoId.value);
};

const handleStartEdit = () => {
  if (!modifying.value) {
    if (todoProgress.value === "completed") return;
    modifying.value = true;
  }
};

const handleEndEdit = (update) => {
  emit("update-item", todoId.value, update);
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
        :id="`chk-${todoId}`"
        :checked="selected"
        @input="handleSelect"
      />
      <label :for="`chk-${todoId}`"></label>
    </div>
    <div class="grow-2 basis-16 text-center text-ellipsis overflow-hidden">
      {{ todoTitle }}
    </div>
    <div
      class="flex h-full flex-row flex-wrap justify-start items-start gap-2 grow-1 basis-16 overflow-x-hidden overflow-y-scroll"
    >
      <div
        class="bg-yellow-400 text-xs text-center text-nowrap text-ellipsis px-3 py-1 rounded-full overflow-hidden"
        v-for="label in todoLabels"
      >
        {{ label }}
      </div>
    </div>
    <div class="flex flex-col justify-center grow-1 basis-16 text-center">
      <span class="material-symbols-rounded" :class="todoProgress">
        {{ progressIcon }}
      </span>
    </div>
    <div class="grow-2 basis-16 text-center">
      {{ untilDateString }}
    </div>
    <div
      class="flex flex-row justify-center items-center grow-1 basis-16 text-center"
    >
      <span class="material-symbols-outlined" @click="handleToggleProgress"
        >check</span
      >
      <span class="material-symbols-outlined" @click="handleStartEdit"
        >edit</span
      >
      <span class="material-symbols-outlined" @click="handleDelete">
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
