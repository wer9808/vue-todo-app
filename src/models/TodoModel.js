class TodoModel {
  constructor(
    id,
    title,
    progress,
    until,
    createdAt,
    content = "",
    labels = [],
  ) {
    this._id = id;
    this.title = title;
    this.progress = progress;
    this.until = until;
    this.createdAt = createdAt;
    this.content = content;
    this.labels = labels;
  }

  get id() {
    return this._id;
  }

  static fromObject({
    id,
    title,
    progress,
    until,
    createdAt,
    content,
    labels,
  }) {
    return new TodoModel(
      id,
      title,
      progress,
      until,
      createdAt,
      content,
      labels,
    );
  }

  static create({ title, until }) {
    const id = crypto.randomUUID();
    const untilCopy = new Date(until.getTime());
    const now = new Date();
    return new TodoModel(id, title, "wait", untilCopy, now);
  }

  serialize() {
    return {
      id: this.id,
      title: this.title,
      progress: this.progress,
      until: this.until.getTime(),
      createdAt: this.createdAt.getTime(),
      content: this.content,
      labels: this.labels,
    };
  }

  static serialize(todo) {
    return {
      id: todo.id,
      title: todo.title,
      progress: todo.progress,
      until: todo.until.getTime(),
      createdAt: todo.createdAt.getTime(),
      content: todo.content,
      labels: todo.labels,
    };
  }

  static fromSerialized(serializedTodo) {
    return new TodoModel(
      serializedTodo.id,
      serializedTodo.title,
      serializedTodo.progress,
      new Date(serializedTodo.until),
      new Date(serializedTodo.createdAt),
      serializedTodo.content,
      serializedTodo.labels,
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
