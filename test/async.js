const util = require('util')
const sleep = util.promisify(setTimeout)

const { assert } = require('chai')
const StreamUtils = require('../')

describe('StreamUtils', () => {
  describe('#map', () => {
    context('func is AsyncFunction', () => {
      it('processes for each item', done => {
        const ARRAY = [1, 2, 3];
        const RESULT_ARRAY = [2, 4, 6];

        const arrayReader = StreamUtils.readArray(ARRAY);
        const twiceStream = StreamUtils.map(async function(number) {
          await sleep(1);
          return number * 2;
        });

        arrayReader.pipe(twiceStream);
        twiceStream.on('data', item => {
          assert.equal(item, RESULT_ARRAY.shift())
        });
        twiceStream.on('end', () => {
          assert.isEmpty(RESULT_ARRAY);
          done();
        });
      })

      context('if an error raises', () => {
        it('catches the error', done => {
          const arrayReader = StreamUtils.readArray([1]);
          const errorStream = StreamUtils.map(async function(number) {
            await sleep(1);
            throw new Error('check error')
          });

          arrayReader.pipe(errorStream);
          errorStream.on('error', err => {
            assert.equal(err.message, 'check error')
            done();
          });
        })
      })
    })
  })
})
