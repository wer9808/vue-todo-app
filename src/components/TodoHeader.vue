<script setup>
const emit = defineEmits(["change-filter"]);

const { currentFilter, filters } = defineProps({
  currentFilter: String,
  filters: Array,
});

const changeFilter = (id) => {
  emit("change-filter", id);
};
</script>

<template>
  <div class="todo-header">
    <div class="title">TodoTodo</div>
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

.todo-header > .title {
  margin: 16px;
  font-size: 3rem;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
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
