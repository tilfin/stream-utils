# stream-utils

Instead of readArray, map of [event-stream](https://github.com/dominictarr/event-stream)

## Install

```
$ npm install @tilfin/stream-utils
```

## How to use

### StreamUtils.readArray

Create a readable object stream from static array data.

**StreamUtils.readArray(values)**

- **values** `<array>` - data array

### StreamUtils.map

Create a transform stream from an asynchronous function.

**StreamUtils.map(func)**

- **func** `<Function|AsyncFunction>` - `function(item, callback) { ... }` or `async function(item) { ... }`

### An example

```js
const StreamUtils = require('@tilfin/stream-utils')

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

arrayReader.pipe(twiceStream);
twiceStream.on('data', item => {
  console.log(item)
});
twiceStream.on('end', () => {
  console.log('END')
});
```

#### Result

```
2
4
6
END
```
