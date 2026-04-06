import { ref, computed, watch } from "vue";
import { useTodoStore } from "@/stores/TodoStore";
import { TextAttributeFilter } from "@/libs/filters/Filter";
import { useSelectionList } from "@/hooks/useSelectionList";
import TodoModel from "@/models/TodoModel";
import { useProgressFilterSet } from "@/hooks/useFilterSet";
import { defineStore } from "pinia";

export const useTodoContainer = defineStore("todo-container", () => {
  const _todoStore = useTodoStore();

  const _selectionList = useSelectionList(TodoModel.equals);

  const _progressFilterSet = useProgressFilterSet();

  const _searchTitle = ref("");
  const _titleSearchFilter = new TextAttributeFilter("title", "title", "");

  watch(_searchTitle, (value, oldValue) => {
    _titleSearchFilter.text = value;
  });

  const _displayTodos = computed(() => {
    let todos = _todoStore.items;
    const filterByProgress = _progressFilterSet.filter.value;
    todos = filterByProgress(todos);
    if (_searchTitle.value) {
      todos = _titleSearchFilter.filter(todos);
    }
    return todos;
  });

  // 필터 변경 시 선택 아이템 초기화
  watch(_displayTodos, (current, old) => {
    if (current != old) {
      _selectionList.clear();
    }
  });

  // 아이템 변화 시 표시 목록에서 사라진 선택 아이템 초기화
  watch(_displayTodos, (current, old) => {
    if (current.length != old.length) {
      old.forEach((oldTodo) => {
        _selectionList.unselect(oldTodo);
      });
    }
  });

  const _filter = {
    progress(value) {
      _progressFilterSet.choose(value);
      let todos = _todoStore.items;
      const filterByProgress = _progressFilterSet.filter.value;
      todos = filterByProgress(todos);
      console.log(todos);
    },
    title(value) {
      _searchTitle.value = value;
      console.log(_displayTodos);
    },
  };

  const _selection = {
    items: _selectionList.items,
    select: _selectionList.select,
    selectAll: _selectionList.selectAll,
    find: _selectionList.find,
    unselect: _selectionList.unselect,
    toggle: _selectionList.toggle,
    clear: _selectionList.clear,
  };

  return {
    displayItems: _displayTodos,
    filter: _filter,
    selection: _selection,
  };
});
