<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { computed, ref } from "vue";
import TodoEditModal from "./TodoEditModal.vue";
import { useTodoListItem } from "./useTodoListItem";

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

const itemState = useTodoListItem({ todo: todo, emit });
const { id, title, progress, until, labels } = itemState;

const modifying = ref(false);

const untilDateString = computed(() => {
  const untilDate = new Date(until.value);
  const year = untilDate.getFullYear().toString();
  const month = (untilDate.getMonth() + 1).toString();
  const day = untilDate.getDate().toString();
  const hour = untilDate.getHours().toString();
  const ampm = DateUtil.getAmPmString(untilDate);
  const minute = DateUtil.getMinuteString(untilDate);

  return `${year}년 ${month}월 ${day}일 ${hour}:${minute} ${ampm}`;
});

const progressIcon = computed(() => {
  switch (progress.value) {
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

const handleStartEdit = () => {
  if (!modifying.value) {
    if (progress.value === "completed") return;
    modifying.value = true;
  }
};

const handleEndEdit = (update) => {
  itemState.update(update);
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
        :id="`chk-${id}`"
        :checked="selected"
        @input="handleSelect"
      />
      <label :for="`chk-${id}`"></label>
    </div>
    <div class="grow-2 basis-16 text-center text-ellipsis overflow-hidden">
      {{ title }}
    </div>
    <div
      class="flex h-full flex-row flex-wrap justify-start items-start gap-2 grow-1 basis-16 overflow-x-hidden overflow-y-scroll"
    >
      <div
        class="bg-yellow-400 text-xs text-center text-nowrap text-ellipsis px-3 py-1 rounded-full overflow-hidden"
        v-for="label in labels"
      >
        {{ label }}
      </div>
    </div>
    <div class="flex flex-col justify-center grow-1 basis-16 text-center">
      <span class="material-symbols-rounded" :class="progress">
        {{ progressIcon }}
      </span>
    </div>
    <div class="grow-2 basis-16 text-center">
      {{ untilDateString }}
    </div>
    <div
      class="flex flex-row justify-center items-center grow-1 basis-16 text-center"
    >
      <span class="material-symbols-outlined" @click="itemState.toggleProgress"
        >check</span
      >
      <span class="material-symbols-outlined" @click="handleStartEdit"
        >edit</span
      >
      <span class="material-symbols-outlined" @click="itemState.delete">
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
