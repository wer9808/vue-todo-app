<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits(["change-filter"]);

const { currentFilter, filters } = defineProps({
  currentFilter: String,
  filters: Array,
});

const now = ref(new Date());

const timeString = computed(() => now.value.toLocaleTimeString());
const dateString = computed(() => now.value.toLocaleDateString());

const changeFilter = (id) => {
  emit("change-filter", id);
};

// 시간 갱신 타이머 핸들
let clockInterval;

// 마운트 시 타이머 시작
onMounted(() => {
  clockInterval = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

// 언마운트 시 타이머 해제
onUnmounted(() => {
  clearInterval(clockInterval);
});
</script>

<template>
  <div class="todo-header">
    <div class="title-container">
      <div class="title">TodoTodo</div>
      <div class="datetime-box">
        <div class="date">{{ dateString }}</div>
        <div class="clock">{{ timeString }}</div>
      </div>
    </div>
    <ul class="todo-filter-tab">
      <li
        v-for="filter in filters"
        :key="filter.id"
        :class="filter.id === currentFilter ? `active` : ``"
        @click="changeFilter(filter.id)"
      >
        {{ filter.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
}

.title-container {
  margin: 16px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
}

.datetime-box {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
}

.datetime-box > .date {
  font-size: 1.2rem;
}

.datetime-box > .clock {
  font-size: 2rem;
}

.todo-filter-tab {
  flex: 0 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  gap: 8px;
  margin: 16px 8px;
  padding: 0;
}

.todo-filter-tab > li {
  flex: 1 1 auto;
  list-style: none;
  cursor: pointer;
  text-align: center;
  border: 1px solid lightgray;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 2px 8px lightgray;
}

.todo-filter-tab > li:hover {
  color: white;
  background-color: deepskyblue;
}

.todo-filter-tab > li.active {
  background-color: dodgerblue;
  color: white;
}
</style>
