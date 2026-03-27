<script setup>
import { ref, computed } from "vue";
import TodoHeader from "./components/TodoHeader.vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import { todoStore } from "./stores/TodoStore";

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
    until: new Date(storeTodo.until),
    createdAt: new Date(storeTodo.createdAt),
  };
};
const storedTodos = todoStore.selectAll().map((val) => convertStoreTodo(val));
const allTodos = ref(storedTodos);

const displayTodos = computed(() => {
  if (currentFilter.value === "completed") {
    return allTodos.value.filter((todo) => {
      return todo.completed;
    });
  }
  if (currentFilter.value === "incompleted") {
    return allTodos.value.filter((todo) => {
      return !todo.completed;
    });
  }
  return allTodos.value;
});

const findTodoById = (todoId) => {
  return allTodos.value.find((item) => item.id === todoId);
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
  allTodos.value.push(newTodo);
  todoStore.upsert(newTodo);
};

const updateTodo = (todo, { content, until }) => {
  todo.content = content;
  todo.until = until;
  todoStore.upsert(todo);
};

const deleteTodo = (todo) => {
  const idx = allTodos.value.indexOf(todo);
  allTodos.value.splice(idx, 1);
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
  todoStore.update(todo);
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
</script>

<template>
  <div class="container">
    <div class="todo-container">
      <div class="todo-container-static">
        <TodoHeader
          :current-filter="currentFilter"
          :filters="filters"
          @change-filter="handleChangeFilter"
        />
        <TodoList
          :items="displayTodos"
          @toggle-todo-complete="handleToggleTodoComplete"
          @delete-todo="handleDeleteTodo"
          @edit-todo="handleEditTodo"
        />
      </div>
      <div class="todo-container-sticky">
        <TodoInput @add-todo="handleAddTodo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.todo-container {
  padding: 8px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.todo-container-static {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}

.todo-container-sticky {
  flex: 0 0 100px;
  position: sticky;
  bottom: 16px;
}
</style>
