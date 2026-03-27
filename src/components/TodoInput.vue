<script setup>
import { DateUtil } from "@/libs/DateUtil";
import { computed, ref } from "vue";

const emit = defineEmits(["add-todo"]);

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

const todoContent = ref("");

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

const handleContentInput = ($e) => {
  todoContent.value = $e.target.value;
};

const handleDateInput = ($e) => {
  inputDateValue.value = $e.target.value;
};

const handleTimeInput = ($e) => {
  inputTimeValue.value = $e.target.value;
};

const addTodo = () => {
  if (!selectedDateTime.value) return;
  const now = new Date();
  const minimum = 60 * 1000;
  if (selectedDateTime.value.getTime() < now.getTime() + minimum) {
    alert("최소 한 시간 이후 날짜를 선택해주세요");
    return;
  }
  const content = todoContent.value.trim();
  if (!content) {
    alert("할 일을 입력해주세요");
    return;
  }
  emit("add-todo", {
    content: todoContent.value,
    until: selectedDateTime.value,
  });
  todoContent.value = "";
  resetUntil();
};
</script>

<template>
  <div class="todo-input">
    <input
      class="todo-input-date"
      type="date"
      :value="inputDateValue"
      @input="handleDateInput"
    />
    <input
      class="todo-input-time"
      type="time"
      :value="inputTimeValue"
      @input="handleTimeInput"
    />
    <input
      type="text"
      class="todo-input-text"
      placeholder="할 일을 입력하세요."
      :value="todoContent"
      @input="handleContentInput"
    />
    <button class="todo-input-submit-btn" @click="addTodo">등록</button>
  </div>
</template>

<style scoped>
.todo-input {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 1px 2px 2px 2px lightgray;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 8px;
}

.todo-input-date {
  flex: 0 0 80px;
  padding: 12px;
  border: 1px solid lightgray;
  border-radius: 32px;
}

.todo-input-time {
  flex: 0 0 80px;
  padding: 12px;
  border: 1px solid lightgray;
  border-radius: 32px;
}

.todo-input-text {
  flex: 1 1 200px;
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 12px 16px;
  font-size: 1rem;
}

.todo-input-text:focus {
  outline: none;
}

.todo-input-submit-btn {
  color: white;
  background-color: dodgerblue;
  flex: 0 0 80px;
  border: none;
  border-radius: 32px;
  padding: 12px;
  box-shadow: 1px 2px 2px lightgray;
  font-weight: normal;
  font-size: 1rem;
  cursor: pointer;
}

.todo-input-submit-btn:hover {
  background-color: deepskyblue;
  box-shadow: none;
}
</style>
