<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { useTodoStore } from "@/stores/TodoStore";
import { computed, ref } from "vue";

const todoStore = useTodoStore();

const toDateInputValue = (datetime) => {
  const yearStr = datetime.getFullYear().toString();
  const monthStr = DateUtil.getMonthString(datetime);
  const dayStr = DateUtil.getDayString(datetime);

  return `${yearStr}-${monthStr}-${dayStr}`;
};

const toTimeInputValue = (datetime) => {
  const hourStr = DateUtil.getHourString(datetime);
  const minuteStr = DateUtil.getMinuteString(datetime);

  return `${hourStr}:${minuteStr}`;
};

const getDefaultUntil = () => {
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const defaultDateTime = new Date(now.getTime() + oneDayMs);
  return defaultDateTime;
};

const todoTitle = ref("");

const inputDateValue = ref();
const inputTimeValue = ref();

const resetUntil = () => {
  const initialUntil = getDefaultUntil();
  inputDateValue.value = toDateInputValue(initialUntil);
  inputTimeValue.value = toTimeInputValue(initialUntil);
};

resetUntil();

const selectedDateTime = computed(() => {
  const dateString = inputDateValue.value;
  const timeString = `${inputTimeValue.value}:00`;
  const datetime = new Date(`${dateString} ${timeString}`);
  return datetime;
});

const handleTitleInput = ($e) => {
  todoTitle.value = $e.target.value;
};

const handleDateInput = ($e) => {
  inputDateValue.value = $e.target.value;
};

const handleTimeInput = ($e) => {
  inputTimeValue.value = $e.target.value;
};

const handleSubmit = () => {
  if (!selectedDateTime.value) return;
  const now = new Date();
  const minimum = 1 * 1000;
  if (selectedDateTime.value.getTime() < now.getTime() + minimum) {
    alert("현재 시간 이후 날짜를 선택해주세요");
    return;
  }
  const title = todoTitle.value.trim();
  if (!title) {
    alert("할 일을 입력해주세요");
    return;
  }
  todoStore.create({
    title: todoTitle.value,
    until: selectedDateTime.value,
  });
  todoTitle.value = "";
  resetUntil();
};
</script>

<template>
  <div
    class="flex w-full flex-col sm:flex-row justify-center items-center sm:items-center gap-2 bg-white m-2 p-4 border-1 border-gray-100 rounded-xl shadow-md shadow-gray-400"
  >
    <input
      class="flex-1 w-full max-w-xs sm:flex-none sm:basis-32 px-4 py-2 border-1 border-gray-200 rounded-full"
      type="date"
      :value="inputDateValue"
      @input="handleDateInput"
    />
    <input
      class="flex-1 w-full max-w-xs sm:flex-none sm:basis-24 px-4 py-2 border-1 border-gray-200 rounded-full"
      type="time"
      :value="inputTimeValue"
      @input="handleTimeInput"
    />
    <input
      type="text"
      class="flex-1 w-full max-w-xs sm:basis-32 px-4 py-2 border-1 border-gray-200 rounded-full"
      placeholder="제목을 입력하세요."
      :value="todoTitle"
      @input="handleTitleInput"
    />
    <button
      class="flex-1 w-full max-w-xs sm:flex-none sm:basis-24 bg-blue-400 text-white px-4 py-2 border-none rounded-full cursor-pointer hover:bg-blue-300"
      @click="handleSubmit"
    >
      등록
    </button>
  </div>
</template>

<style scoped></style>
