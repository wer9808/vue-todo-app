<script setup>
import { ref, computed, reactive } from "vue";
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

const inputTitle = ref(todo.title);

const until = new Date(todo.until.getTime());

const inputDateValue = ref(toDateInputValue(until));
const inputTimeValue = ref(toTimeInputValue(until));

const selectedDateTime = computed(() => {
  const dateString = inputDateValue.value;
  const timeString = `${inputTimeValue.value}:00`;
  const datetime = new Date(`${dateString} ${timeString}`);
  return datetime;
});

const labels = reactive([...todo.labels]);
const inputLabelValue = ref("");

const handleTitleInput = ($e) => {
  inputTitle.value = $e.target.value;
};

const handleDateInput = ($e) => {
  inputDateValue.value = $e.target.value;
};

const handleTimeInput = ($e) => {
  inputTimeValue.value = $e.target.value;
};

const handleLabelInput = ($e) => {
  inputLabelValue.value = $e.target.value;
};

const handleAddLabel = ($e) => {
  const newLabel = inputLabelValue.value.trim();
  if (newLabel && labels.findIndex((label) => label === newLabel) < 0) {
    labels.push(newLabel);
    inputLabelValue.value = "";
  }
};

const handleDeleteLabel = (deleteLabel) => {
  const idx = labels.findIndex((label) => label === deleteLabel);
  if (idx >= 0) {
    labels.splice(idx, 1);
  }
};

const endEdit = () => {
  if (!selectedDateTime.value) return;
  const now = new Date();
  const minimum = 1 * 1000;
  if (selectedDateTime.value.getTime() < now.getTime() + minimum) {
    alert("현재 시간 이후 날짜를 선택해주세요");
    return;
  }
  const title = inputTitle.value.trim();
  if (!title) {
    alert("제목을 입력해주세요");
    return;
  }

  const update = {
    title: inputTitle.value,
    until: selectedDateTime,
    labels: labels,
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
        <label>제목</label>
        <input type="text" :value="inputTitle" @input="handleTitleInput" />
        <label>종료일</label>
        <input type="date" :value="inputDateValue" @input="handleDateInput" />
        <input type="time" :value="inputTimeValue" @input="handleTimeInput" />
        <label>라벨</label>
        <div class="add-label-box">
          <input
            type="text"
            @input="handleLabelInput"
            :value="inputLabelValue"
          />
          <button @click="handleAddLabel">+</button>
        </div>
        <div class="todo-label-box">
          <div class="todo-label" v-for="label in labels">
            <div>{{ label }}</div>
            <span
              class="material-symbols-outlined"
              @click="handleDeleteLabel(label)"
              >close</span
            >
          </div>
        </div>
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

.properties-box > input {
  outline: none;
}

.properties-box > input[type="text"] {
  flex: 0 0 32px;
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 4px 12px;
  text-align: end;
}

.properties-box > input[type="date"],
.properties-box > input[type="time"] {
  flex: 0 0 32px;
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 4px 12px;
  text-align: center;
}

.properties-box > input:focus {
  border: 1px solid dodgerblue;
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

.add-label-box {
  flex: 0 0 40px;
  display: flex;
  padding: 0;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 8px;
}

.add-label-box > input {
  flex: 1 1 auto;
  height: 40px;
  background: none;
  border: 1px solid lightgray;
  border-radius: 32px;
  padding: 0 16px;
  outline: none;
  text-align: end;
  font-size: 1rem;
}

.add-label-box > input:focus {
  border: 1px solid dodgerblue;
}

.add-label-box > button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  padding: 0;
  color: white;
  background-color: dodgerblue;
  font-size: 1.5rem;
}

.todo-label-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  gap: 8px;
}

.todo-label {
  flex: 0 0 auto;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: orange;
  border: none;
  border-radius: 32px;
  padding: 4px 8px;
}

.todo-label > div {
  flex: 1 0 24px;
  padding: 4px 8px;
  text-align: center;
}

.todo-label > span {
  background-color: none;
  color: black;
  padding: 4px 4px;
  font-size: 16px;
}
</style>
