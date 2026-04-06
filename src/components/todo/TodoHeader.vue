<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useTodoContainer } from "@/components/todo/useTodoContainer";

class ProgressFilterItem {
  constructor(key, text, value) {
    this.key = key;
    this.text = text;
    this.value = value;
  }
}

const progressFilters = reactive([
  new ProgressFilterItem("all", "전체", ""),
  new ProgressFilterItem("wait", "대기", "wait"),
  new ProgressFilterItem("ongoing", "진행중", "ongoing"),
  new ProgressFilterItem("completed", "완료", "completed"),
]);

const currentFilterIndex = ref(0);
const currentFilter = computed(() => {
  return progressFilters[currentFilterIndex.value];
});

const containerState = useTodoContainer();

const now = ref(new Date());

const timeString = computed(() => now.value.toLocaleTimeString());
const dateString = computed(() => now.value.toDateString());

const handleSearchInput = ($e) => {
  const searchText = $e.target.value;
  containerState.filter.title(searchText);
};

const handleClickProgressFilter = (index) => {
  currentFilterIndex.value = index;
  containerState.filter.progress(currentFilter.value.value);
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
  <div class="flex w-full flex-initial flex-col m-2">
    <div class="flex flex-initial flex-row justify-between items-center my-2">
      <div class="flex-initial text-3xl md:text-6xl">TodoTodo</div>
      <div class="flex-1 flex flex-col justify-start items-end">
        <div class="md:text-xl">{{ dateString }}</div>
        <div class="md:text-3xl">{{ timeString }}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 my-2 gap-4">
      <li
        v-for="(filter, idx) in progressFilters"
        :key="filter.name"
        class="list-none text-center my-0 md:my-2 py-4 border-1 border-gray-100 rounded-md shadow-md shadow-gray-300 cursor-pointer hover:bg-sky-300 hover:text-white hover:border-none"
        :class="
          currentFilterIndex === idx
            ? `bg-sky-500 text-white border-none pointer-events-none`
            : `bg-white text-black`
        "
        @click="handleClickProgressFilter(idx)"
      >
        {{ filter.text }}
      </li>
    </div>
    <div
      class="flex flex-row justify-center md:justify-end items-center basis-auto mx-1 my-4 md:my-2"
    >
      <input
        class="flex-none w-xs sm:w-sm md:w-60 bg-white text-md md:text-sm md:text-base text-center md:text-end placeholder:text-gray-400 placeholder:text-shadow-sm px-4 py-3 md:py-2 outline-2 outline-gray-200 rounded-full shadow-md shadow-gray-400 focus:outline-2 focus:outline-blue-400 focus:placeholder:text-blue-400"
        type="text"
        placeholder="검색"
        @input="handleSearchInput"
      />
    </div>
  </div>
</template>

<style scoped></style>
