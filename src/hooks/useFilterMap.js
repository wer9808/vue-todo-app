import { ref } from "vue";

/*
TodoItem 필터를 적용하는 커스텀 훅
필터 리스트를 입력 받아서 관리
필터 리스트 내에서 각 필터의 ID는 고유해야 함
중복될 경우 중복된 필터 중 마지막만 저장

return : [ filter, setFilter ]

filter : 현재 적용 중인 필터 반환
setFilter : 특정 filter 아이디를 받아 적용할 필터를 해당 필터로 교체
*/
export const useFilterMap = (...filters) => {
  const _filters = ref({});
  const _currentFilter = ref(null);

  filters.forEach((filter) => {
    _filters.value[filter.id] = filter;
    if (_currentFilter.value === null) {
      _currentFilter.value = filter;
    }
  });

  const _setFilter = (id) => {
    const filter = _filters.value[id];
    if (filter) {
      _currentFilter.value = filter;
    }
  };

  const _clearFilter = () => {
    _currentFilter.value = null;
  };

  return {
    current: _currentFilter,
    set: _setFilter,
    clear: _clearFilter,
  };
};
