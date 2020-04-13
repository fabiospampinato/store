
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {batch, Hooks, onChange, store} from '../../x';

/* BATCH */

describe ( 'batch', it => {

  it.serial ( 'batches updates happening inside an asynchronous function', async t => {

    const proxy = store ({ foo: 123, bar: 123, baz: { test: 123 } }),
          onChangeCalls = [],
          hookChangeCalls = [],
          hookChangeBatchCalls = [];

    onChange ( proxy, () => {
      onChangeCalls.push ( 0 );
    });

    Hooks.store.change.subscribe ( ( proxy, paths ) => {
      hookChangeCalls.push ( paths );
    });

    Hooks.store.changeBatch.subscribe ( ( proxy, paths, root ) => {
      hookChangeBatchCalls.push ([ paths, root ]);
    });

    await batch ( async () => {
      proxy.foo = 0;
      await delay ( 10 );
      proxy.bar = 1;
      await delay ( 10 );
      proxy.baz.test = 2;
    });

    await delay ( 100 );

    t.deepEqual ( onChangeCalls, [0] );
    t.deepEqual ( hookChangeCalls, [['foo'], ['bar'], ['baz.test']] );
    t.deepEqual ( hookChangeBatchCalls, [[['foo', 'bar', 'baz.test'], ['foo', 'bar', 'baz']]] );

  });

  it.serial ( 'supports throwing functions', async t => {

    const proxy = store ({ foo: 123, bar: 123, baz: { test: 123 } }),
          onChangeCalls = [],
          hookChangeCalls = [],
          hookChangeBatchCalls = [];

    onChange ( proxy, () => {
      onChangeCalls.push ( 0 );
    });

    Hooks.store.change.subscribe ( ( proxy, paths ) => {
      hookChangeCalls.push ( paths );
    });

    Hooks.store.changeBatch.subscribe ( ( proxy, paths, root ) => {
      hookChangeBatchCalls.push ([ paths, root ]);
    });

    try {

      await batch ( async () => {
        proxy.foo = 0;
        await delay ( 10 );
        proxy.bar = 1;
        throw new Error ( 'foo' );
        await delay ( 10 );
        proxy.baz.test = 2;
      });

    } catch ( err ) {

      t.is ( err.message, 'foo' );

    }

    await delay ( 100 );

    t.deepEqual ( onChangeCalls, [0] );
    t.deepEqual ( hookChangeCalls, [['foo'], ['bar']] );
    t.deepEqual ( hookChangeBatchCalls, [[['foo', 'bar'], ['foo', 'bar']]] );

  });

  it.serial ( 'supports nested batches', async t => {

    const proxy = store ({ foo: 123, bar: 123, baz: { test: 123 } }),
          onChangeCalls = [],
          hookChangeCalls = [],
          hookChangeBatchCalls = [];

    onChange ( proxy, () => {
      onChangeCalls.push ( 0 );
    });

    Hooks.store.change.subscribe ( ( proxy, paths ) => {
      hookChangeCalls.push ( paths );
    });

    Hooks.store.changeBatch.subscribe ( ( proxy, paths, root ) => {
      hookChangeBatchCalls.push ([ paths, root ]);
    });

    await batch ( async () => {
      proxy.foo = 0;
      await delay ( 10 );
      await batch ( async () => {
        proxy.bar = 1;
        await delay ( 10 );
        await batch ( async () => {
          proxy.baz.test = 2;
          await delay ( 10 );
        })
      });
    });

    await delay ( 100 );

    t.deepEqual ( onChangeCalls, [0] );
    t.deepEqual ( hookChangeCalls, [['foo'], ['bar'], ['baz.test']] );
    t.deepEqual ( hookChangeBatchCalls, [[['foo', 'bar', 'baz.test'], ['foo', 'bar', 'baz']]] );

  });

  it.serial ( 'supports batching without the wrapper function', async t => {

    const proxy = store ({ foo: 123, bar: 123, baz: { test: 123 } }),
          onChangeCalls = [],
          hookChangeCalls = [],
          hookChangeBatchCalls = [];

    onChange ( proxy, () => {
      onChangeCalls.push ( 0 );
    });

    Hooks.store.change.subscribe ( ( proxy, paths ) => {
      hookChangeCalls.push ( paths );
    });

    Hooks.store.changeBatch.subscribe ( ( proxy, paths, root ) => {
      hookChangeBatchCalls.push ([ paths, root ]);
    });

    batch.start ();
    proxy.foo = 0;
    await delay ( 10 );
    proxy.bar = 1;
    await delay ( 10 );
    proxy.baz.test = 2;
    batch.stop ();

    await delay ( 100 );

    t.deepEqual ( onChangeCalls, [0] );
    t.deepEqual ( hookChangeCalls, [['foo'], ['bar'], ['baz.test']] );
    t.deepEqual ( hookChangeBatchCalls, [[['foo', 'bar', 'baz.test'], ['foo', 'bar', 'baz']]] );

  });

});
