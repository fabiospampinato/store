
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {onChange, store} from '../../x';

/* ON CHANGE */

describe ( 'onChange', it => {

  it ( 'schedules a call to the listener when a mutation is made to the object', async t => {

    const tests = [
      /* NO MUTATION */
      [proxy => proxy.foo = 123, false],
      [proxy => proxy.bar = { deep: true }, false],
      [proxy => proxy.arr = [1, 2, '3'], false],
      [proxy => proxy.arr[0] = 1, false],
      [proxy => proxy.arr.length = 3, false],
      [proxy => proxy.nan = NaN, false],
      [proxy => delete proxy.qux, false],
      /* MUTATION */
      [proxy => proxy.foo = 1234, true],
      [proxy => proxy.bar = { deep: false }, true],
      [proxy => proxy.bar = { deep: undefined }, true],
      [proxy => proxy.bar = { deep: null }, true],
      [proxy => proxy.bar = { deep: NaN }, true],
      [proxy => proxy.bar = { deep2: '123' }, true],
      [proxy => proxy.bar = { deep2: undefined }, true],
      [proxy => proxy.bar = { deep2: null }, true],
      [proxy => proxy.bar = { deep2: NaN }, true],
      [proxy => proxy.arr = [1], true],
      [proxy => proxy.arr[0] = 2, true],
      [proxy => proxy.arr.push ( 4 ), true],
      [proxy => proxy.arr.length = 4, true],
      [proxy => proxy.nan = Infinity, true],
      [proxy => proxy.qux = undefined, true],
      [proxy => delete proxy['foo'], true]
    ];

    for ( const [fn, shouldMutate] of tests ) {

      let callsNr = 0;

      const proxy = store ({
        foo: 123,
        bar: { deep: true },
        arr: [1, 2, '3'],
        nan: NaN
      });

      function listener ( data ) {
        t.deepEqual ( data, proxy );
        callsNr++;
      }

      onChange ( proxy, listener );

      fn ( proxy );

      t.is ( callsNr, 0 );

      await delay ( 10 );

      t.is ( callsNr, Number ( shouldMutate ) );

    }

  });

  it ( 'supports an optional selector', async t => {

    const proxy = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
          calls = [];

    function listener1 ( data ) {
      t.true ( typeof data === 'number' );
      calls.push ( 1 );
    }

    function listener2 ( data ) {
      t.is ( data, proxy.foo );
      calls.push ( 2 );
    }

    function listener3 ( data ) {
      t.deepEqual ( data, proxy.bar );
      calls.push ( 3 );
    }

    onChange ( proxy, () => Math.random (), listener1 );
    onChange ( proxy, data => data.foo, listener2 );
    onChange ( proxy, data => data.bar, listener3 );

    proxy['baz'] = true;
    proxy.foo = 1234;
    proxy.bar['foo'] = true;

    await delay ( 10 );

    t.deepEqual ( calls, [1, 2, 3] );

  });

  it ( 'doesn\'t schedule a call to the listener if the return value of the selector didn\'t actually change', async t => {

    const proxy = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
          calls = [];

    onChange ( proxy, () => calls.push ( 0 ) );
    onChange ( proxy, state => state.foo, () => calls.push ( 1 ) );
    onChange ( proxy, state => state.bar, () => calls.push ( 2 ) );
    onChange ( proxy, state => state.bar.deep[0], () => calls.push ( 3 ) );

    proxy.foo = 123;
    proxy.bar = proxy.bar;
    proxy.bar = { deep: [1, 2, 3] };
    proxy.bar.deep[0] = 1;

    await delay ( 10 );

    t.deepEqual ( calls, [] );

    proxy.foo = 1234;

    await delay ( 10 );

    t.deepEqual ( calls, [0, 1] );

    proxy.bar['foo'] = true;

    await delay ( 10 );

    t.deepEqual ( calls, [0, 1, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

    proxy.bar.deep.push ( 4 );

    await delay ( 10 );

    t.deepEqual ( calls, [0, 1, 0, 2, 3, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

    proxy.bar.deep[0] = 2;

    await delay ( 10 );

    t.deepEqual ( calls, [0, 1, 0, 2, 3, 0, 2, 3, 0, 2, 3] );

  });

  it ( 'returns a disposer', async t => {

    const proxy = store ({ foo: 123 });

    let callsNr = 0;

    function listener () {
      callsNr++;
    }

    onChange ( proxy, listener )();
    onChange ( proxy, () => Math.random (), listener )();

    proxy.foo = 1234;

    await delay ( 10 );

    t.is ( callsNr, 0 );

  });

});
