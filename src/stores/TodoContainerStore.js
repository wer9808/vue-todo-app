import { useFilterMap } from "@/hooks/useFilterMap";

const { ref, computed } = require("vue");
const { useTodoFilterStore } = require("./TodoFilterStore");
const { useTodoStore } = require("./TodoStore");
const { Filter, TextSearchFilter } = require("@/models/Filter");

const _todoStore = useTodoStore();

const _progressFilterSet = [
  new TodoAttributeFilter("wait", "progress", "대기"),
  new TodoAttributeFilter("ongoing", "progress", "진행중"),
  new TodoAttributeFilter("completed", "progress", "완료"),
];

const _progressFilter = useFilterMap(..._progressFilterSet);

const _searchTitle = ref("");
const _titleSearchFilter = new TextSearchFilter("title", "title", "");

const _displayTodos = computed(() => {
  let todos = _todoStore.items;
  if (_progressFilter.current.value) {
    todos = _progressFilter.current.value.filter(todos);
  }
  if (_searchTitle.value) {
    todos = _titleSearchFilter.filter(todos);
  }
  return _displayTodos;
});

export const useTodoContainerStore = () => {
  return {
    displayItems: _displayTodos,
    filter: {
      progress(value) {
        if (value === null) {
          _progressFilter.clear();
        } else {
          _progressFilter.set(value);
        }
      },
      title(value) {
        _searchTitle.value = value;
      },
    },
  };
};
