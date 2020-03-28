
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {onChange, store} from '../../x';

/* ON CHANGE */

describe ( 'onChange', it => {

  describe ( 'single store', it => {

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

        await delay ( 100 );

        t.is ( callsNr, Number ( shouldMutate ) );

      }

    });

    it ( 'works with simple selectors', async t => {

      let callsNr = 0;

      const proxy = store ({
        foo: 123,
        bar: 123
      });

      function listener () {
        callsNr++;
      }

      onChange ( proxy, proxy => proxy, listener );
      onChange ( proxy, proxy => ([ proxy ]), listener );
      onChange ( proxy, proxy => { proxy.bar; return proxy; }, listener );

      proxy.foo = 0;

      t.is ( callsNr, 0 );

      await delay ( 100 );

      t.is ( callsNr, 3 );

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

      await delay ( 100 );

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

      await delay ( 100 );

      t.deepEqual ( calls, [] );

      proxy.foo = 1234;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1] );

      proxy.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

      proxy.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 2, 3, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

      proxy.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 2, 3, 0, 2, 3, 0, 2, 3] );

    });

    it ( 'throws if no ChangeSubscriber has been found ', t => {

      t.throws ( () => onChange ( {}, () => {} ), /garbage-collected/i );

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

      await delay ( 100 );

      t.is ( callsNr, 0 );

    });

  });

  describe ( 'multiple stores', it => {

    it ( 'coalesces mutations from different stores', async t => {

      let callsNr = 0;

      const proxy1 = store ({ foo: 123 }),
            proxy2 = store ({ bar: 123 });

      function listener ( data1, data2 ) {
        t.deepEqual ( data1, proxy1 );
        t.deepEqual ( data2, proxy2 );
        callsNr++;
      }

      onChange ( [proxy1, proxy2], listener );

      proxy1.foo = 0;
      proxy2.bar = 0;

      t.is ( callsNr, 0 );

      await delay ( 100 );

      t.is ( callsNr, 1 );

    });

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

        const proxy1 = store ({
          foo: 123,
          bar: { deep: true },
          arr: [1, 2, '3'],
          nan: NaN
        });

        const proxy2 = store ({
          foo: 123,
          bar: { deep: true },
          arr: [1, 2, '3'],
          nan: NaN
        });

        function listener ( data1, data2 ) {
          t.deepEqual ( data1, proxy1 );
          t.deepEqual ( data2, proxy2 );
          callsNr++;
        }

        onChange ( [proxy1, proxy2], listener );

        fn ( proxy1 );

        t.is ( callsNr, 0 );

        await delay ( 100 );

        t.is ( callsNr, Number ( shouldMutate ) );

        callsNr = 0;

        fn ( proxy2 );

        await delay ( 100 );

        t.is ( callsNr, Number ( shouldMutate ) );

      }

    });

    it ( 'works with simple selectors', async t => {

      let callsNr = 0;

      const proxy1 = store ({ foo: 123, bar: 123 }),
            proxy2 = store ({ foo: 123, bar: 123 });

      function listener () {
        callsNr++;
      }

      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1, listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2, listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => ([ proxy1 ]), listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => ([ proxy2 ]), listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => ([ proxy1, proxy2 ]), listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => { proxy1.bar; return proxy1; }, listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => { proxy2.bar; return proxy2; }, listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => { proxy1.bar; return proxy2; }, listener );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => { proxy2.bar; return proxy1; }, listener );

      proxy1.foo = 0;
      proxy2.foo = 0;

      t.is ( callsNr, 0 );

      await delay ( 100 );

      t.is ( callsNr, 9 );

    });

    it ( 'supports an optional selector', async t => {

      const proxy1 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            proxy2 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            calls = [];

      function listener1 ( data ) {
        t.true ( typeof data === 'number' );
        calls.push ( 1 );
      }

      function listener2 ( data ) {
        t.is ( data, proxy1.foo );
        calls.push ( 2 );
      }

      function listener3 ( data ) {
        t.is ( data, proxy1.bar );
        calls.push ( 3 );
      }

      function listener4 ( data ) {
        t.is ( data, proxy2.foo );
        calls.push ( 4 );
      }

      function listener5 ( data ) {
        t.is ( data, proxy2.bar );
        calls.push ( 5 );
      }

      onChange ( [proxy1, proxy2], () => Math.random (), listener1 );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.foo, listener2 );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.bar, listener3 );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.foo, listener4 );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.bar, listener5 );

      proxy1['baz'] = true;
      proxy1.foo = 1234;
      proxy1.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [1, 2, 3] );

      proxy2['baz'] = true;
      proxy2.foo = 1234;
      proxy2.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [1, 2, 3, 1, 4, 5] );

    });

    it ( 'doesn\'t schedule a call to the listener if the return value of the selector didn\'t actually change', async t => {

      const proxy1 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            proxy2 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            calls = [];

      onChange ( [proxy1, proxy2], () => calls.push ( 0 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.foo, () => calls.push ( 1 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.bar, () => calls.push ( 2 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.bar.deep[0], () => calls.push ( 3 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.foo, () => calls.push ( 4 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.bar, () => calls.push ( 5 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.bar.deep[0], () => calls.push ( 6 ) );

      proxy1.foo = 123;
      proxy1.bar = proxy1.bar;
      proxy1.bar = { deep: [1, 2, 3] };
      proxy1.bar.deep[0] = 1;

      proxy2.foo = 123;
      proxy2.bar = proxy2.bar;
      proxy2.bar = { deep: [1, 2, 3] };
      proxy2.bar.deep[0] = 1;

      await delay ( 100 );

      t.deepEqual ( calls, [] );

      proxy1.foo = 1234;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1] );

      proxy2.foo = 1234;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4] );

      proxy1.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

      proxy2.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3, 0, 5, 6] ); // The last `3` here is called unoptimally for performance reasons

      proxy1.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3, 0, 5, 6, 0, 2, 3] ); // The last `3` here is called unoptimally for performance reasons

      proxy2.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3, 0, 5, 6, 0, 2, 3, 0, 5, 6] ); // The last `3` here is called unoptimally for performance reasons

      proxy1.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3, 0, 5, 6, 0, 2, 3, 0, 5, 6, 0, 2, 3] );

      proxy2.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 3, 0, 5, 6, 0, 2, 3, 0, 5, 6, 0, 2, 3, 0, 5, 6] );

    });

    it ( 'throws if no ChangeSubscriber has been found ', t => {

      t.throws ( () => onChange ( [{}, []], () => {} ), /garbage-collected/i );

    });

    it ( 'throws if an empty array of stores has been provided ', t => {

      t.throws ( () => onChange ( [], () => {} ), /empty/i );

    });

    it ( 'returns a disposer', async t => {

      const proxy1 = store ({ foo: 123 }),
            proxy2 = store ({ foo: 123 });

      let callsNr = 0;

      function listener () {
        callsNr++;
      }

      onChange ( [proxy1, proxy2], listener )();
      onChange ( [proxy1, proxy2], () => Math.random (), listener )();

      proxy1.foo = 1234;
      proxy2.foo = 1234;

      await delay ( 100 );

      t.is ( callsNr, 0 );

    });

  });

});
