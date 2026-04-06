import { ref, computed, watch } from "vue";
import { useTodoStore } from "../../stores/TodoStore";
import { TextAttributeFilter } from "@/libs/filters/Filter";
import { useSelectionList } from "@/hooks/useSelectionList";
import TodoModel from "@/models/TodoModel";
import { useProgressFilterSet } from "@/hooks/useFilterSet";

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

export const useTodoContainer = () => {
  return {
    displayItems: _displayTodos,
    filter: {
      progress(value) {
        _progressFilterSet.choose(value);
      },
      title(value) {
        _searchTitle.value = value;
      },
    },
    selectionList: _selectionList,
  };
};
