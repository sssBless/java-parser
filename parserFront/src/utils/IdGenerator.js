class AutoIncrement {
  constructor(initialValue = 0) {
    this.currentValue = initialValue;
  }

  getNextValue() {
    return (this.currentValue++).toString();
  }
}

export default AutoIncrement;
