const { assert } = require('chai')
const StreamUtils = require('../')

describe('StreamUtils', () => {
  describe('#readArray', () => {
    it('provides for each item', done => {
      const ARRAY = [1, 'B', { foo: 'bar' }];

      const arrayReader = StreamUtils.readArray(ARRAY.concat());
      arrayReader.on('data', item => {
        assert.deepEqual(item, ARRAY.shift())
      });
      arrayReader.on('end', () => {
        assert.isEmpty(ARRAY);
        done();
      });
    })
  })

  describe('#map', () => {
    context('func is Function', () => {
      it('processes for each item', done => {
        const ARRAY = [1, 2, 3];
        const RESULT_ARRAY = [2, 4, 6];

        const arrayReader = StreamUtils.readArray(ARRAY);
        const twiceStream = StreamUtils.map(function (number, cb) {
          cb(null, number * 2)
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
          const errorStream = StreamUtils.map(function (number, cb) {
            cb(new Error('check error'))
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

// Only test when Node version supports async/await
const vers = process.versions.node.split('.').map(v => Number(v));
if (vers[0] > 7 || (vers[0] === 7 && vers[1] >= 6)) {
  require('./async')
}
