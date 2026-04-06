import { ref, computed } from "vue";
import { AttributeFilter } from "@/libs/filters/Filter";

export const useProgressFilterSet = () => {
  const _progressFilterSet = [
    new AttributeFilter("wait", "progress"),
    new AttributeFilter("ongoing", "progress"),
    new AttributeFilter("completed", "progress"),
  ];

  const _filterNames = ["wait", "ongoing", "completed"];

  const _currentFilter = ref(null);

  const _choose = (name) => {
    _currentFilter.value =
      _progressFilterSet.find((filter) => filter.name === name) ?? null;
  };

  const _filterFunc = computed(() => {
    return (itemArr) => {
      if (_currentFilter.value) {
        return _currentFilter.value.filter(itemArr);
      }
      return [...itemArr];
    };
  });

  return {
    names: _filterNames,
    choose: _choose,
    filter: _filterFunc,
  };
};
