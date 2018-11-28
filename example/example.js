const StreamUtils = require('../')

const arrayReader = StreamUtils.readArray([1, 2, 3]);
const twiceStream = StreamUtils.map(function (num, cb) {
  if (typeof num === 'number') {
    cb(null, num * 2)
  } else {
    cb(new Error('Not a number'))
  }
});
/* Async
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

arrayReader.pipe(twiceStream);
twiceStream.pipe(arrayWriter);
