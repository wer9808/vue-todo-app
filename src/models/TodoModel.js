class TodoModel {
  constructor(id, content, progress, until, createdAt) {
    this.id = id;
    this.content = content;
    this.progress = progress;
    this.until = until;
    this.createdAt = createdAt;
  }

  static fromObject({ id, content, progress, until, createdAt }) {
    return new TodoModel(id, content, progress, until, createdAt);
  }

  static create({ content, until }) {
    const now = new Date();
    const id = now.getTime();
    return new TodoModel(id, content, "wait", new Date(until.getTime()), now);
  }

  serialize() {
    return {
      id: this.id,
      content: this.content,
      progress: this.progress,
      until: this.until.getTime(),
      createdAt: this.createdAt.getTime(),
    };
  }

  static serialize(todo) {
    return {
      id: todo.id,
      content: todo.content,
      progress: todo.progress,
      until: todo.until.getTime(),
      createdAt: todo.createdAt.getTime(),
    };
  }

  static fromSerialized(serializedTodo) {
    return new TodoModel(
      serializedTodo.id,
      serializedTodo.content,
      serializedTodo.progress,
      new Date(serializedTodo.until),
      new Date(serializedTodo.createdAt),
    );
  }

  static equals(a, b) {
    return a.id === b.id;
  }

  equals(other) {
    return this._id === other.id;
  }
}

export default TodoModel;
