
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {store, Hooks} from '../../x';

/* HOOKS */

describe ( 'Hooks', it => {

  it ( 'can dispose of a listener', t => {

    Hooks.store.new.subscribe ( t.fail )();

    store ( {} );

    t.pass ();

  });

  describe ( 'store.change', it => {

    it ( 'triggers each time a change is detected', t => {

      t.plan ( 5 );

      const data = {
        foo: true,
        bar: [1, 2, { baz: true }]
      };

      const proxy = store ( data );

      const results = [[proxy, ['foo']], [proxy, ['bar.0']]];

      let callNr = 0;

      Hooks.store.change.subscribe ( ( proxy, paths ) => {
        t.deepEqual ( proxy, results[callNr][0] );
        t.deepEqual ( paths, results[callNr][1] );
        callNr++;
      });

      proxy.foo = false;
      proxy.bar[0] = 0;

      t.is ( callNr, 2 );

    });

  });

  describe ( 'store.changeBatch', it => {

    it.only ( 'triggers each time a change is detected (batched)', async t => {

      t.plan ( 5 );

      const data = {
        foo: true,
        bar: [1, 2, { baz: true }]
      };

      const proxy = store ( data );

      let callNr = 0;

      Hooks.store.changeBatch.subscribe ( ( p, paths, roots ) => {
        t.deepEqual ( p, proxy );
        t.deepEqual ( paths, ['foo', 'bar.0', 'bar.1'] );
        t.deepEqual ( roots, ['foo', 'bar'] );
        callNr++;
      });

      proxy.foo = false;
      proxy.bar[0] = 0;
      proxy.bar[1] = 1;

      t.is ( callNr, 0 );

      await delay ( 100 );

      t.is ( callNr, 1 );

    });

  });

  describe ( 'store.new', it => {

    it ( 'triggers whenever a store is created', t => {

      t.plan ( 2 );

      const data = {
        foo: true,
        bar: [1, 2, { baz: true }]
      };

      Hooks.store.new.subscribe ( proxy => {
        t.deepEqual ( data, proxy );
      });

      const proxy = store ( data );

      t.deepEqual ( data, proxy );

    });

  });

});
