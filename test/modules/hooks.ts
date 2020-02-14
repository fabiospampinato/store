
/* IMPORT */

import {describe} from 'ava-spec';
import {store, Hooks} from '../../x';

/* HOOKS */

describe ( 'Hooks', it => {

  it ( 'can dispose of a listener', t => {

    Hooks.store.new.subscribe ( t.fail )();

    store ( {} );

    t.pass ();

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
