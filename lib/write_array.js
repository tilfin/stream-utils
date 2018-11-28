const { Writable } = require('stream');

class ArrayWriter extends Writable {
  constructor(callback) {
    super({ objectMode: true });
    this.values = [];
    this.on('error', callback);
    this.on('finish', () => {
      callback(null, this.values)
    });
  }

  _write(item, _, cb) {
    this.values.push(item);
    cb();
  }
}

module.exports = function writeArray(callback) {
  return new ArrayWriter(callback);
}
