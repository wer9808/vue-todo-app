import { ref, unref, computed } from "vue";

export const useSelectionList = (equals) => {
  const _selectedItems = ref([]);
  const _equals = (a, b) => {
    return equals(unref(a), unref(b));
  };

  const _findIndex = (item) => {
    return _selectedItems.value.findIndex((selectedItem) =>
      _equals(selectedItem, item),
    );
  };

  const _exists = (item) => {
    return _findIndex(item) >= 0;
  };

  const _find = (item) => {
    return _selectedItems.value.find((selectedItem) =>
      _equals(selectedItem, item),
    );
  };

  const _select = (item) => {
    if (!_exists(item)) {
      _selectedItems.value.push(item);
    }
  };

  const _unselect = (item) => {
    const idx = _findIndex(item);
    if (idx >= 0) {
      _selectedItems.value.splice(idx, 1);
    }
  };

  const _toggle = (item) => {
    const idx = _findIndex(item);
    if (idx >= 0) {
      _selectedItems.value.splice(idx, 1);
    } else {
      _selectedItems.value.push(item);
    }
  };

  const _clear = (item) => {
    _selectedItems.value = [];
  };

  const _selectAll = (items) => {
    _selectedItems.value = items;
  };

  return {
    items: _selectedItems,
    selectAll: _selectAll,
    find: _find,
    select: _select,
    unselect: _unselect,
    toggle: _toggle,
    clear: _clear,
  };
};
