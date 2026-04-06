import { computed } from "vue";

export const useTodoListItem = ({ todo, onDelete, onSelect, onUpdate }) => {
  const _todo = todo;
  const _id = computed(() => _todo.id);
  const _title = computed(() => _todo.title);
  const _progress = computed(() => _todo.progress);
  const _until = computed(() => _todo.until);
  const _untilDate = computed(() => new Date(_todo.until));
  const _labels = computed(() => _todo.labels);

  const toggleProgress = () => {
    let nextProgress = _progress.value;
    if (nextProgress === "wait") {
      nextProgress = "ongoing";
    } else if (nextProgress === "ongoing") {
      nextProgress = "completed";
    } else if (nextProgress === "completed") {
      nextProgress = "wait";
    }
    onUpdate(_id.value, { progress: nextProgress });
  };

  const deleteItem = () => {
    onDelete(_id.value);
  };

  const selectItem = () => {
    onSelect(_id.value);
  };

  const updateItem = (update) => {
    onUpdate(_id.value, update);
  };

  return {
    id: _id,
    title: _title,
    progress: _progress,
    until: _until,
    untilDate: _untilDate,
    labels: _labels,
    toggleProgress: toggleProgress,
    delete: deleteItem,
    select: selectItem,
    update: updateItem,
  };
};
