import { TodoFilter, TodoAttributeFilter } from "@/models/TodoFilter";
import { useFilterMap } from "@/hooks/useTodoFilter";

const _mainFilters = [
  new TodoFilter("all", "전체"),
  new TodoAttributeFilter("wait", "progress", "대기"),
  new TodoAttributeFilter("ongoing", "progress", "진행중"),
  new TodoAttributeFilter("completed", "progress", "완료"),
];

const [filter, setFilter] = useFilterMap(..._mainFilters);

export const useMainFilters = () => {
  return [filter, setFilter, _mainFilters];
};
