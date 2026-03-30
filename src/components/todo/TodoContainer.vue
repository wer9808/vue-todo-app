<script setup>
import { ref, computed, reactive, watch, unref } from "vue";
import TodoHeader from "@/components/todo/TodoHeader.vue";
import TodoInput from "@/components/todo/TodoInput.vue";
import TodoList from "@/components/todo/TodoList.vue";
import { todoStore } from "@/stores/TodoStore";
import TodoModel from "@/models/TodoModel";
import { useSelectionList } from "@/hooks/useSelectionList";

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

const storedTodos = todoStore
  .selectAll()
  .map((storeTodo) => TodoModel.fromSerialized(storeTodo));
const allTodos = reactive(storedTodos);

const displayTodos = computed(() => {
  const todos = currentFilter.value.filter(allTodos);
  return todos;
});

const selectionList = useSelectionList(TodoModel.equals);

// 필터 변경 시 선택 아이템 초기화
watch(currentFilter, (current, old) => {
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
  todoStore.upsert(newTodo);
};

const updateTodo = (todo, { content, until, progress }) => {
  if (content) todo.content = content;
  if (until) todo.until = until;
  if (progress) todo.progress = progress;
  todoStore.update(unref(todo));
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
