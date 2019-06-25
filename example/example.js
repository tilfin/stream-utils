const StreamUtils = require('../')

const arrayReader = StreamUtils.readArray([1, 2, 3]);
const oddStream = StreamUtils.map(function (num, cb) {
  if (num % 2) {
    cb(null, num)
  } else {
    cb(null)
  }
});
const addCopyStream = StreamUtils.map(function (num, cb) {
  this.push(num)
  this.push(num)
  cb()
});
const twiceStream = StreamUtils.map(function (num, cb) {
  if (typeof num === 'number') {
    cb(null, num * 2)
  } else {
    cb(new Error('Not a number'))
  }
});
/* Async
const oddStream = StreamUtils.map(async function (num) {
  if (num % 2) return num
});
const addCopyStream = StreamUtils.map(function (num, ctx) {
  ctx.push(num)
  ctx.push(num)
  cb()
});
const twiceStream = StreamUtils.map(async function (num) {
  if (typeof num === 'number') {
    return num * 2;
  } else {
    throw new Error('Not a number');
  }
});
 */

const arrayWriter = StreamUtils.writeArray(function (err, values) {
  console.log(values)
});

arrayReader
  .pipe(oddStream)       // => [1, 3]
  .pipe(addCopyStream) // => [1, 1, 3, 3]
  .pipe(twiceStream)     // => [2, 2, 6, 6]
  .pipe(arrayWriter);
