const storeKey = "todo_store_key";

const store = JSON.parse(localStorage.getItem(storeKey)) ?? {};
console.log(`store initialized ${JSON.stringify(store)}`);

function commit() {
  localStorage.setItem(storeKey, JSON.stringify(store));
}

export const todoStore = {
  insert(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    if (store[todo.id]) {
      console.log(`이미 저장된 객체입니다. [id=${todo.id}]`);
      return;
    }
    store[todo.id] = this.toStoreData(todo);
    commit();
  },
  delete(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    delete store[todo.id];
    commit();
  },
  update(todo) {
    if (!todo.id) {
      console.log("TODO 객체에 ID가 없습니다.");
      return;
    }
    if (!store[todo.id]) {
      console.log(`존재하지 않는 객체입니다. [id=${todo.id}]`);
      return;
    }
    store[todo.id] = this.toStoreData(todo);
    commit();
  },
  upsert(todo) {
    if (!store[todo.id]) {
      this.insert(todo);
    } else {
      this.update(todo);
    }
  },
  selectAll() {
    // store 값을 카피해서 전달
    const arr = [];
    Object.values(store).forEach((val) => {
      arr.push({ ...val });
    });
    return arr;
  },
  // store에 저장하기 위한 형태로 변환
  toStoreData(todo) {
    return {
      id: todo.id,
      content: todo.content,
      completed: todo.completed,
      until: todo.until.getTime(),
      createdAt: todo.createdAt.getTime(),
    };
  },
};
