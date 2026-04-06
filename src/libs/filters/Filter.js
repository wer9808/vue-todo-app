export class Filter {
  constructor(name) {
    this.name = name;
    this.filterType = "default";
  }

  filter(itemArr) {
    return [...itemArr];
  }
}

export class AttributeFilter extends Filter {
  constructor(name, attr) {
    super(name);
    this.attr = attr;
    this.filterType = "attribute";
  }

  filter(itemArr) {
    return [...itemArr.filter((item) => item[this.attr] === this.name)];
  }
}

export class TextAttributeFilter extends Filter {
  constructor(name, attr, mode = "include") {
    super(name);
    this.attr = attr;
    this.filterType = "textsearch";
    this._text = "";
    this._mode = mode;
  }

  /**
   * @param {string} value
   */
  set text(value) {
    this._text = value;
  }

  filter(itemArr) {
    return this.includeFilter(itemArr);
  }

  includeFilter(itemArr) {
    return [
      ...itemArr.filter(
        (item) =>
          typeof item[this.attr] === "string" &&
          item[this.attr].includes(this._text),
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
