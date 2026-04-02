import { Filter, AttributeFilter } from "@/models/Filter";
import { useFilterMap } from "@/hooks/useFilterMap";

const _mainFilters = [
  new Filter("all", "전체"),
  new AttributeFilter("wait", "progress", "대기"),
  new AttributeFilter("ongoing", "progress", "진행중"),
  new AttributeFilter("completed", "progress", "완료"),
];

const [filter, setFilter] = useFilterMap(..._mainFilters);

export const useTodoFilterStore = () => {
  return [filter, setFilter, _mainFilters];
};
