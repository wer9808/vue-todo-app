<script setup>
import { ref, computed, reactive, watch } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { todoStore } from "@/stores/TodoStore";

class TodoFilter {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.filterType = "none";
  }

  filter(itemArr) {
    return [...itemArr];
  }
}

class TodoLabelFilter extends TodoFilter {
  constructor(id, label, text) {
    super(id, text);
    this.label = label;
    this.filterType = "label";
  }

  filter(itemArr) {
    return [...itemArr.filter((item) => item[this.label] === this.id)];
  }
}

const allFilter = new TodoFilter("all", "전체");
const waitFilter = new TodoLabelFilter("wait", "progress", "대기");
const ongoingFilter = new TodoLabelFilter("ongoing", "progress", "진행중");
const completedFilter = new TodoLabelFilter("completed", "progress", "완료");

const filters = [allFilter, waitFilter, ongoingFilter, completedFilter];
const currentFilterId = ref("all");
const currentFilter = computed(() => {
  return filters.find((filter) => filter.id === currentFilterId.value);
});

const convertStoreTodo = (storeTodo) => {
  return {
    id: storeTodo.id,
    content: storeTodo.content,
    progress: storeTodo.progress,
    selected: false,
    until: new Date(storeTodo.until),
    createdAt: new Date(storeTodo.createdAt),
  };
};

const storedTodos = todoStore.selectAll().map((val) => convertStoreTodo(val));
const allTodos = reactive(storedTodos);

const displayTodos = computed(() => {
  const todos = currentFilter.value.filter(allTodos);
  return todos;
});

const selectedTodos = computed(() => {
  return allTodos.filter((todo) => todo.selected);
});

// 필터 변경 시 선택 아이템 초기화
watch(currentFilter, (current, old) => {
  if (current != old) {
    allTodos.forEach((todo) => (todo.selected = false));
  }
});

// 아이템 변화 시 표시 목록에서 사라진 선택 아이템 초기화
watch(displayTodos, (current, old) => {
  if (current.length != old.length) {
    old.forEach((oldTodo) => {
      if (!current.find((todo) => todo.id === oldTodo.id)) {
        oldTodo.selected = false;
      }
    });
  }
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
    progress: "wait",
    until: until,
    createdAt: datetime,
  };
  allTodos.push(newTodo);
  todoStore.upsert(newTodo);
};

const updateTodo = (todo, { content, until, progress }) => {
  if (content) todo.content = content;
  if (until) todo.until = until;
  if (progress) todo.progress = progress;
  todoStore.update(todo);
};

const deleteTodo = (todo) => {
  const idx = allTodos.indexOf(todo);
  allTodos.splice(idx, 1);
  todoStore.delete(todo);
};

const handleChangeFilter = (filterId) => {
  currentFilterId.value = filterId;
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
  todo.selected = !todo.selected;
};

const handleSelectMultiTodos = (todoIds, selected) => {
  todoIds.forEach((todoId) => {
    const todo = findTodoById(todoId);
    if (!todo) return;
    todo.selected = selected;
  });
};

const handleChangeSelectedTodos = (name, value) => {
  const targetTodos = selectedTodos.value.slice();
  targetTodos.forEach((todo) => {
    const update = {};
    update[name] = value;
    updateTodo(todo, update);
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
      :current-filter="currentFilterId"
      :filters="filters"
      @change-filter="handleChangeFilter"
    />
    <TodoList
      :items="displayTodos"
      :selectedItems="selectedTodos"
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
