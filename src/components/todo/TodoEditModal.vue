<script setup>
import { ref, computed } from "vue";
import { DateUtil } from "@/libs/DateUtil";

const emit = defineEmits(["end-edit", "cancel-edit"]);
const { todo } = defineProps(["todo"]);

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

const inputContent = ref(todo.content);

const until = new Date(todo.until.getTime());

const inputDateValue = ref(toDateInputValue(until));
const inputTimeValue = ref(toTimeInputValue(until));

const selectedDateTime = computed(() => {
  const dateString = inputDateValue.value;
  const timeString = `${inputTimeValue.value}:00`;
  const datetime = new Date(`${dateString} ${timeString}`);
  return datetime;
});

const handleContentInput = ($e) => {
  inputContent.value = $e.target.value;
};

const handleDateInput = ($e) => {
  inputDateValue.value = $e.target.value;
};

const handleTimeInput = ($e) => {
  inputTimeValue.value = $e.target.value;
};

const endEdit = () => {
  if (!selectedDateTime.value) return;
  const now = new Date();
  const minimum = 1 * 1000;
  if (selectedDateTime.value.getTime() < now.getTime() + minimum) {
    alert("현재 시간 이후 날짜를 선택해주세요");
    return;
  }
  const content = inputContent.value.trim();
  if (!content) {
    alert("할 일을 입력해주세요");
    return;
  }

  const update = {
    content: inputContent.value,
    until: selectedDateTime,
  };
  emit("end-edit", update);
};

const cancelEdit = () => {
  emit("cancel-edit");
};
</script>

<template>
  <div class="container">
    <div class="modal-box">
      <h2>TODO 변경</h2>
      <div class="properties-box">
        <label>TODO</label>
        <input type="text" :value="inputContent" @input="handleContentInput" />
        <label>종료일</label>
        <input type="date" :value="inputDateValue" @input="handleDateInput" />
        <input type="time" :value="inputTimeValue" @input="handleTimeInput" />
      </div>
      <div class="control-box">
        <button class="submit-btn" @click="endEdit">완료</button>
        <button class="cancel-btn" @click="cancelEdit">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.modal-box {
  position: absolute;
  background-color: white;
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
  border-radius: 16px;
  padding: 16px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
}

.properties-box {
  flex: 1 1 auto;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 8px;
}

.properties-box > label {
  margin-top: 8px;
}

.properties-box > input[type="text"] {
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 12px;
}

.properties-box > input[type="date"],
.properties-box > input[type="time"] {
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 12px;
  text-align: center;
}

.control-box {
  flex: 0 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 8px;
}

.control-box > button {
  color: white;
  border: none;
  border-radius: 32px;
  padding: 8px 16px;
}

.control-box > .submit-btn {
  background-color: dodgerblue;
}

.control-box > .cancel-btn {
  background-color: lightslategray;
}
</style>
