
/* IMPORT */

import {describe} from 'ava-spec';
import areShallowEqual from 'are-shallow-equal';
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

    it ( 'supports an optional comparator', async t => {

      const proxy = store ({ foo: 123, bar: { deep: [1, 2, 3] }, baz: { title: 'Title', desc: 'Description' } }),
            calls = [];

      function listener1 ( data ) {
        t.true ( typeof data === 'number' );
        calls.push ( 1 );
      }

      function comparator1a ( dataPrev, dataNext ) {
        t.fail ();
        calls.push ( '1a' );
        return false;
      }

      function listener2 ( data ) {
        t.is ( data, proxy.foo );
        calls.push ( 2 );
      }

      function comparator2a ( dataPrev, dataNext ) {
        t.fail ();
        calls.push ( '2a' );
        return false;
      }

      function listener3 ( data ) {
        t.deepEqual ( data, proxy.bar );
        calls.push ( 3 );
      }

      function comparator3a ( dataPrev, dataNext ) {
        t.deepEqual ( dataPrev, dataNext );
        calls.push ( '3a' );
        return true;
      }

      function comparator3b ( dataPrev, dataNext ) {
        t.deepEqual ( dataPrev, dataNext );
        calls.push ( '3b' );
        return false;
      }

      function listener4 ( data ) {
        t.deepEqual ( data, { title: 'Title' } );
        calls.push ( 4 );
      }

      function comparator4a ( dataPrev, dataNext ) {
        t.deepEqual ( dataPrev, dataNext );
        calls.push ( '4a' );
        return areShallowEqual ( dataPrev, { title: 'Title' } );
      }

      function listener5 ( data ) {
        t.deepEqual ( data, { title: proxy.baz.title, desc: proxy.baz.desc } );
        calls.push ( 5 );
      }

      function comparator5a ( dataPrev, dataNext ) {
        calls.push ( '5a' );
        return areShallowEqual ( dataPrev, dataNext );
      }

      onChange ( proxy, () => Math.random (), comparator1a, listener1 );
      onChange ( proxy, data => data.foo, comparator2a, listener2 );
      onChange ( proxy, data => data.bar, comparator3a, listener3 );
      onChange ( proxy, data => data.bar, comparator3b, listener3 );
      onChange ( proxy, data => ({ title: data.baz.title }), comparator4a, listener4 );
      onChange ( proxy, data => ({ title: data.baz.title, desc: data.baz.desc }), comparator5a, listener5 );

      proxy['qux'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [1] );

      proxy.foo = 1234;

      await delay ( 100 );

      t.deepEqual ( calls, [1, 1, 2] );

      proxy.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [1, 1, 2, 1, '3a', '3b', 3] );

      proxy.baz.desc += '2';

      await delay ( 100 );

      t.deepEqual ( calls, [1, 1, 2, 1, '3a', '3b', 3, 1, '4a', '5a', 5] );

      proxy.baz['extra'] = 'foo';

      await delay ( 100 );

      t.deepEqual ( calls, [1, 1, 2, 1, '3a', '3b', 3, 1, '4a', '5a', 5, 1, '4a', '5a'] );

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

      t.deepEqual ( calls, [0, 1, 0, 2] );

      proxy.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 2, 0, 2] );

      proxy.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 2, 0, 2, 0, 2, 3] );

    });

    it ( 'compares primitives', async t => {

      const proxy = store ({ bool: true, number: 123, void: true }),
            calls = [];

      onChange ( proxy, state => state.bool, () => calls.push ( 1 ) );
      onChange ( proxy, state => state.number, () => calls.push ( 2 ) );
      onChange ( proxy, state => state.void, () => calls.push ( 3 ) );

      proxy.bool = false;
      proxy.number = 0;
      proxy.bool = true;
      proxy.number = 123;
      proxy.void = undefined;

      await delay ( 100 );

      t.deepEqual ( calls, [3] );

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

    //TODO: Add 'supports an optional comparator' test

    it ( 'doesn\'t forget previously mutated roots in non flushed changes', async t => {

      const proxy1 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            proxy2 = store ({ foo: 123, bar: { deep: [1, 2, 3] } }),
            calls = [];

      function listener ( data ) {
        t.is ( data, proxy1.bar.deep );
        calls.push ( 1 );
      }

      onChange ( proxy1, () => proxy1.foo = 0 );
      onChange ( [proxy1, proxy2], proxy1 => proxy1.bar.deep, listener );

      proxy1.bar.deep = [1];

      await delay ( 100 );

      t.deepEqual ( calls, [1] );

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

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2] );

      proxy2.bar['foo'] = true;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 0, 5] );

      proxy1.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 0, 5, 0, 2] );

      proxy2.bar.deep.push ( 4 );

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 0, 5, 0, 2, 0, 5] );

      proxy1.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 0, 5, 0, 2, 0, 5, 0, 2, 3] );

      proxy2.bar.deep[0] = 2;

      await delay ( 100 );

      t.deepEqual ( calls, [0, 1, 0, 4, 0, 2, 0, 5, 0, 2, 0, 5, 0, 2, 3, 0, 5, 6] );

    });

    it ( 'compares primitives', async t => {

      const proxy1 = store ({ bool: true, number: 123, void: true }),
            proxy2 = store ({ bool: true, number: 123, void: true }),
            calls = [];

      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.bool, () => calls.push ( 1 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.number, () => calls.push ( 2 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy1.void, () => calls.push ( 3 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.bool, () => calls.push ( 4 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.number, () => calls.push ( 5 ) );
      onChange ( [proxy1, proxy2], ( proxy1, proxy2 ) => proxy2.void, () => calls.push ( 6 ) );

      proxy1.bool = false;
      proxy1.number = 0;
      proxy1.bool = true;
      proxy1.number = 123;
      proxy1.void = undefined;

      proxy2.bool = false;
      proxy2.number = 0;
      proxy2.bool = true;
      proxy2.number = 123;
      proxy2.void = undefined;

      await delay ( 100 );

      t.deepEqual ( calls, [3, 6] );

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
