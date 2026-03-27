<script setup>
import { ref, computed, reactive } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { todoStore } from "@/stores/TodoStore";

class TodoFilter {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }
}

const allFilter = new TodoFilter("all", "전체");
const completedFilter = new TodoFilter("completed", "완료");
const incompletedFilter = new TodoFilter("incompleted", "미완료");

const filters = [allFilter, incompletedFilter, completedFilter];
const currentFilter = ref("all");

const convertStoreTodo = (storeTodo) => {
  return {
    id: storeTodo.id,
    content: storeTodo.content,
    completed: storeTodo.completed,
    selected: false,
    until: new Date(storeTodo.until),
    createdAt: new Date(storeTodo.createdAt),
  };
};
const storedTodos = todoStore.selectAll().map((val) => convertStoreTodo(val));
const allTodos = reactive(storedTodos);

const displayTodos = computed(() => {
  if (currentFilter.value === "completed") {
    return allTodos.filter((todo) => {
      return todo.completed;
    });
  }
  if (currentFilter.value === "incompleted") {
    return allTodos.filter((todo) => {
      return !todo.completed;
    });
  }
  return allTodos;
});

const selectedTodos = computed(() => {
  return allTodos.filter((todo) => todo.selected);
});

const findTodoById = (todoId) => {
  return allTodos.find((todo) => todo.id === todoId);
};

const createTodo = ({ content, until }) => {
  const datetime = new Date();
  const id = datetime.getTime();
  const newTodo = {
    id: id,
    content: content,
    completed: false,
    until: until,
    createdAt: datetime,
  };
  allTodos.push(newTodo);
  todoStore.upsert(newTodo);
};

const updateTodo = (todo, { content, until, completed }) => {
  if (content) todo.content = content;
  if (until) todo.until = until;
  if (completed) todo.completed = completed;
  todoStore.update(todo);
};

const deleteTodo = (todo) => {
  const idx = allTodos.indexOf(todo);
  allTodos.splice(idx, 1);
  todoStore.delete(todo);
};

const handleChangeFilter = (filterId) => {
  currentFilter.value = filterId;
};

const handleAddTodo = (todo) => {
  createTodo(todo);
};

const handleToggleTodoComplete = (todoId) => {
  const todo = findTodoById(todoId);
  if (!todo) return;
  todo.completed = !todo.completed;
  updateTodo(todo, { completed: todo.completed });
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
  todo.selected = !todo.selected;
};

const handleSelectMultiTodos = (todoIds, selected) => {
  todoIds.forEach((todoId) => {
    const todo = findTodoById(todoId);
    if (!todo) return;
    todo.selected = selected;
  });
};

const handleCompleteSelectedTodos = () => {
  const targetTodos = selectedTodos.value.slice();
  targetTodos.forEach((todo) => {
    todo.completed = true;
    todo.selected = false;
    updateTodo(todo, { completed: todo.completed });
  });
};

const handleDeleteSelectedTodos = () => {
  const targetTodos = selectedTodos.value.slice();
  targetTodos.forEach((todo) => {
    deleteTodo(todo);
    todo.selected = false;
  });
};
</script>

<template>
  <div class="todo-container">
    <TodoHeader
      :current-filter="currentFilter"
      :filters="filters"
      @change-filter="handleChangeFilter"
    />
    <TodoList
      :items="displayTodos"
      :selectedItems="selectedTodos"
      @toggle-todo-complete="handleToggleTodoComplete"
      @delete-todo="handleDeleteTodo"
      @edit-todo="handleEditTodo"
      @select-todo="handleSelectTodo"
      @select-multi-todos="handleSelectMultiTodos"
      @complete-selected-todos="handleCompleteSelectedTodos"
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
