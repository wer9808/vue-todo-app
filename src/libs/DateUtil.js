export class DateUtil {
  static addPaddingBeforeTen(value, padding = "0") {
    return value < 10 ? padding + value : value;
  }

  static getMonthString(date, padding = "0") {
    const month = date.getMonth() + 1;
    return DateUtil.addPaddingBeforeTen(month, padding);
  }

  static getDayString(date, padding = "0") {
    const day = date.getDate();
    return DateUtil.addPaddingBeforeTen(day, padding);
  }

  static getHourString(date, ampm = false, padding = "0") {
    let hour = date.getHours();
    if (ampm) {
      hour = hour >= 12 ? hour - 12 : hour;
    }
    return DateUtil.addPaddingBeforeTen(hour, padding);
  }

  static getMinuteString(date, padding = "0") {
    const minute = date.getMinutes();
    return DateUtil.addPaddingBeforeTen(minute, padding);
  }

  static getSecondString(date, padding = "0") {
    const second = date.getSeconds();
    return DateUtil.addPaddingBeforeTen(second, padding);
  }

  static getAmPmString(date) {
    return date.getHours() < 12 ? "AM" : "PM";
  }
}
