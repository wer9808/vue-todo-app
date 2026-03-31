const storageKey = "todo_store_key";

const _storage = JSON.parse(localStorage.getItem(storageKey)) ?? {};
console.log(`store initialized`);

function commit() {
  localStorage.setItem(storageKey, JSON.stringify(_storage));
}

export const todoStorage = {
  insert(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    if (_storage[todo.id]) {
      console.log(`이미 저장된 객체입니다. [id=${todo.id}]`);
      return;
    }
    _storage[todo.id] = todo.serialize();
    commit();
  },
  delete(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    delete _storage[todo.id];
    commit();
  },
  update(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    if (!_storage[todo.id]) {
      console.log(`존재하지 않는 객체입니다. [id=${todo.id}]`);
      return;
    }
    _storage[todo.id] = todo.serialize();
    commit();
  },
  upsert(todo) {
    if (!_storage[todo.id]) {
      this.insert(todo);
    } else {
      this.update(todo);
    }
  },
  selectAll() {
    // store 값을 카피해서 전달
    const arr = [];
    Object.values(_storage).forEach((val) => {
      arr.push({ ...val });
    });
    return arr;
  },
};
