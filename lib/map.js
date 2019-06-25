const { Transform } = require('stream');

class MapStream extends Transform {
  constructor(func) {
    super({ objectMode: true });

    if (func.constructor.name === 'AsyncFunction') {
      this._func = function(item, cb) {
        func(item, this).then(result => {
          cb(null, result)
        }).catch(cb)
      }
    } else {
      this._func = func
    }    
  }

  _transform(item, _, cb) {
    this._func(item, cb)
  }
}

module.exports = function map(func) {
  return new MapStream(func)
}
