const { Readable } = require('stream');

class ArrayReader extends Readable {
  constructor(values) {
    super({ objectMode: true });
    this._index = 0;
    this._values = values;
  }

  _read() {
    if (this._index < this._values.length) {
      this.push(this._values[this._index++])
    } else {
      this.push(null)
    }
  }
}

module.exports = function readArray(values) {
  return new ArrayReader(values)
}
