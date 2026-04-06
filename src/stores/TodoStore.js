import { reactive, unref } from "vue";
import { todoStorage } from "@/storages/TodoStorage";
import TodoModel from "@/models/TodoModel";

const savedTodos = todoStorage
  .selectAll()
  .map((storeTodo) => TodoModel.fromSerialized(storeTodo));
const allTodos = reactive(savedTodos);

export const useTodoStore = () => {
  const _findFrom = (todoId, todos) => {
    return todos.find((todo) => todo.id === todoId);
  };

  const _find = (todoId) => {
    return _findFrom(todoId, allTodos);
  };

  const _create = ({ title, until }) => {
    const newTodo = TodoModel.create({ title, until });
    allTodos.push(newTodo);
    todoStorage.upsert(newTodo);
  };

  const _update = (todoId, { title, content, until, progress, labels }) => {
    const todo = _find(todoId);
    if (!todo) return;
    if (title != undefined) todo.title = title;
    if (content != undefined) todo.content = content;
    if (until != undefined) todo.until = until;
    if (progress != undefined) todo.progress = progress;
    if (labels != undefined) todo.labels = labels;
    todoStorage.update(unref(todo));
  };

  const _delete = (todoId) => {
    const todo = _find(todoId);
    if (!todo) return;
    const idx = allTodos.indexOf(todo);
    allTodos.splice(idx, 1);
    todoStorage.delete(todo);
  };

  return {
    items: allTodos,
    find: _find,
    create: _create,
    update: _update,
    delete: _delete,
  };
};
