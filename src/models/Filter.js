export class Filter {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.filterType = "none";
  }

  filter(itemArr) {
    return [...itemArr];
  }
}

export class AttributeFilter extends Filter {
  constructor(id, attr, text) {
    super(id, text);
    this.attr = attr;
    this.filterType = "attribute";
  }

  filter(itemArr) {
    return [...itemArr.filter((item) => item[this.attr] === this.id)];
  }
}

export class TextSearchFilter extends Filter {
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

export class CustomFilter extends Filter {
  constructor(id, text, customFilter) {
    super(id, text);
    this._filter = customFilter;
  }

  filter(itemArr) {
    return this._filter(itemArr);
  }
}
