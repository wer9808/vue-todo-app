<script setup>
import { ref, computed, reactive, watch, unref } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { todoStorage } from "@/storages/TodoStorage";
import TodoModel from "@/models/TodoModel";
import { useSelectionList } from "@/hooks/useSelectionList";
import { useMainFilters } from "@/stores/TodoFilterStore";
import { TodoTextSearchFilter } from "@/models/TodoFilter";

const [curFilter, _] = useMainFilters();

const titleSearchFilter = ref(new TodoTextSearchFilter("title", "content", ""));
const searchFilters = reactive([titleSearchFilter]);

const savedTodos = todoStorage
  .selectAll()
  .map((storeTodo) => TodoModel.fromSerialized(storeTodo));
const allTodos = reactive(savedTodos);

const displayTodos = computed(() => {
  let todos = curFilter.value.filter(allTodos);
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

const findTodoById = (todoId) => {
  return allTodos.find((todo) => todo.id === todoId);
};

const createTodo = ({ content, until }) => {
  const newTodo = TodoModel.create({ content, until });
  allTodos.push(newTodo);
  todoStorage.upsert(newTodo);
};

const updateTodo = (todo, { content, until, progress }) => {
  if (content) todo.content = content;
  if (until) todo.until = until;
  if (progress) todo.progress = progress;
  todoStorage.update(unref(todo));
};

const deleteTodo = (todo) => {
  const idx = allTodos.indexOf(todo);
  allTodos.splice(idx, 1);
  todoStorage.delete(todo);
};

const handleChangeFilter = (filter) => {
  curFilter.value = filter;
};

const handleAddTodo = (todo) => {
  createTodo(todo);
};

const handleToggleTodoProgress = (todoId) => {
  const todo = findTodoById(todoId);
  if (!todo) return;
  if (todo.progress === "wait") {
    todo.progress = "ongoing";
  } else if (todo.progress === "ongoing") {
    todo.progress = "completed";
  } else if (todo.progress === "completed") {
    todo.progress = "wait";
  }
  updateTodo(todo, { progress: todo.progress });
};

const handleDeleteTodo = (todoId) => {
  const todo = findTodoById(todoId);
  if (!todo) return;
  deleteTodo(todo);
};

const handleEditTodo = (todoId, update) => {
  const todo = findTodoById(todoId);
  if (!todo) return;
  updateTodo(todo, update);
};

const handleSelectTodo = (todoId) => {
  const todo = findTodoById(todoId);
  if (!todo) return;
  selectionList.toggle(todo);
};

const handleSelectMultiTodos = (todoIds, selected) => {
  todoIds.forEach((todoId) => {
    const todo = findTodoById(todoId);
    if (!todo) return;
    if (selectionList.find(todo)) {
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
    updateTodo(todo, update);
  });
};

const handleDeleteSelectedTodos = () => {
  const targetTodos = selectionList.items.value.slice();
  targetTodos.forEach((todo) => {
    deleteTodo(todo);
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
  <div class="todo-container">
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

<style scoped>
.todo-container {
  padding: 8px;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 8px;
}
</style>
