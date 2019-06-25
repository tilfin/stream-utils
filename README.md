# @tilfin/stream-utils

[![npm](https://img.shields.io/npm/v/@tilfin/stream-utils.svg)](https://www.npmjs.com/package/@tilfin/stream-utils)
[![Node](https://img.shields.io/node/v/@tilfin/stream-utils.svg)]()
[![License](https://img.shields.io/github/license/tilfin/stream-utils.svg)]()
[![dependencies Status](https://david-dm.org/tilfin/stream-utils/status.svg)](https://david-dm.org/tilfin/stream-utils)
[![Build Status](https://travis-ci.org/tilfin/stream-utils.svg?branch=master)](https://travis-ci.org/tilfin/stream-utils)

Instead of readArray, map, writeArray of [event-stream](https://github.com/dominictarr/event-stream)

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

- **func** `<Function|AsyncFunction>` - `function(item, callback) { ... }` or `async function(item, ctx) { ... }`
- Use `ctx` as `this` of normal function.

### StreamUtils.writeArray

Create a writable object stream to callback all of written items.

**StreamUtils.writeArray(callback)**

- **callback** `<Function>` - `function(err, values) { ... }`

### An example

```js
const StreamUtils = require('@tilfin/stream-utils')

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
const addCopyStream = StreamUtils.map(async function (num, ctx) {
  ctx.push(num)
  ctx.push(num)
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
```

#### Result

```
[2, 2, 6, 6]
```
