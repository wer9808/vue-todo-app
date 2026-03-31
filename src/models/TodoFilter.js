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
    this.filterType = "attribute";
  }

  filter(itemArr) {
    return [...itemArr.filter((item) => item[this.attr] === this.id)];
  }
}

export class TodoTextSearchFilter extends TodoFilter {
  constructor(id, attr, text) {
    super(id, text);
    this.attr = attr;
    this.filterType = "textsearch";
    this._search = "";
  }

  /**
   * @param {string} value
   */
  set search(value) {
    this._search = value;
  }

  filter(itemArr) {
    return [
      ...itemArr.filter(
        (item) =>
          typeof item[this.attr] === "string" &&
          item[this.attr].includes(this._search),
      ),
    ];
  }
}

export class TodoCustomFilter extends TodoFilter {
  constructor(id, text, customFilter) {
    super(id, text);
    this._filter = customFilter;
  }

  filter(itemArr) {
    return this._filter(itemArr);
  }
}
