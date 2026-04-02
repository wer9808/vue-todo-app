<script setup>
import { ref, computed, reactive, watch, unref } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { todoStorage } from "@/storages/TodoStorage";
import TodoModel from "@/models/TodoModel";
import { useSelectionList } from "@/hooks/useSelectionList";
import { useTodoFilterStore } from "@/stores/TodoFilterStore";
import { TextSearchFilter } from "@/models/Filter";
import { useTodoStore } from "@/stores/TodoStore";
import { useTodoContainerStore } from "@/stores/TodoContainerStore";

const [curFilter, _] = useTodoFilterStore();

const titleSearchFilter = ref(new TextSearchFilter("title", "title", ""));
const searchFilters = reactive([titleSearchFilter]);

const todoStore = useTodoStore();

const displayTodos = computed(() => {
  let todos = curFilter.value.filter(todoStore.items);
  for (let filter of searchFilters) {
    todos = filter.value.filter(todos);
  }
  return todos;
});

const selectionList = useSelectionList(TodoModel.equals);

// 필터 변경 시 선택 아이템 초기화
watch(curFilter, (current, old) => {
  if (current != old) {
    selectionList.clear();
  }
});

// 아이템 변화 시 표시 목록에서 사라진 선택 아이템 초기화
watch(displayTodos, (current, old) => {
  if (current.length != old.length) {
    old.forEach((oldTodo) => {
      selectionList.unselect(oldTodo);
    });
  }
});

const handleChangeFilter = (filter) => {
  curFilter.value = filter;
};

const handleAddTodo = (todo) => {
  todoStore.create(todo);
};

const handleToggleTodoProgress = (todoId) => {
  const todo = todoStore.find(todoId);
  if (!todo) return;
  let progress = todo.progress;
  if (progress === "wait") {
    progress = "ongoing";
  } else if (progress === "ongoing") {
    progress = "completed";
  } else if (progress === "completed") {
    progress = "wait";
  }
  todoStore.update(todoId, { progress });
};

const handleDeleteTodo = (todoId) => {
  todoStore.delete(todoId);
};

const handleEditTodo = (todoId, update) => {
  todoStore.update(todoId, update);
};

const handleSelectTodo = (todoId) => {
  const todo = todoStore.find(todoId);
  if (!todo) return;
  selectionList.toggle(todo);
};

const handleSelectMultiTodos = (todoIds, allSelected) => {
  todoIds.forEach((todoId) => {
    const todo = todoStore.find(todoId);
    if (!todo) return;
    if (allSelected) {
      selectionList.unselect(todo);
    } else {
      selectionList.select(todo);
    }
  });
};

const handleChangeSelectedTodos = (name, value) => {
  const targetTodos = selectionList.items.value.slice();
  targetTodos.forEach((todo) => {
    const update = {};
    update[name] = value;
    todoStore.update(todo.id, update);
  });
};

const handleDeleteSelectedTodos = () => {
  const targetTodos = selectionList.items.value.slice();
  targetTodos.forEach((todo) => {
    todoStore.delete(todo.id);
    selectionList.unselect(todo);
  });
};

const handleSearchTodos = (searchAttr, value) => {
  if (searchAttr === "title") {
    titleSearchFilter.value.search = value;
  }
};
</script>

<template>
  <div class="w-full flex flex-col justify-start items-center gap-1 p-4">
    <TodoHeader
      @change-filter="handleChangeFilter"
      @search-todos="handleSearchTodos"
    />
    <TodoList
      :items="displayTodos"
      :selectedItems="selectionList.items"
      @toggle-todo-progress="handleToggleTodoProgress"
      @delete-todo="handleDeleteTodo"
      @edit-todo="handleEditTodo"
      @select-todo="handleSelectTodo"
      @select-multi-todos="handleSelectMultiTodos"
      @change-selected-todos="handleChangeSelectedTodos"
      @delete-selected-todos="handleDeleteSelectedTodos"
    />
    <TodoInput @add-todo="handleAddTodo" />
  </div>
</template>

<style scoped></style>
