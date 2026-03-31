export class TodoFilter {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.filterType = "none";
  }

  filter(itemArr) {
    return [...itemArr];
  }
}

export class TodoAttributeFilter extends TodoFilter {
  constructor(id, attr, text) {
    super(id, text);
    this.attr = attr;
    this.filterType = "label";
  }

  filter(itemArr) {
    return [...itemArr.filter((item) => item[this.attr] === this.id)];
  }
}
