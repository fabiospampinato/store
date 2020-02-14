
/* IMPORT */

import {describe} from 'ava-spec';
import {store} from '../../x';
import ChangesCounters from '../../x/changes_counters';

/* CHANGES COUNTERS */

describe ( 'ChangesCounters', it => {

  it ( 'stores the number of times a store changed', t => {

    const data = {
      foo: true,
      bar: [1, 2, { baz: true }]
    };

    const proxy = store ( data );

    t.is ( ChangesCounters.get ( proxy ), 0 );

    proxy.foo = true;

    t.is ( ChangesCounters.get ( proxy ), 0 );

    proxy.foo = false;
    proxy.foo = true;
    proxy.foo = false;

    t.is ( ChangesCounters.get ( proxy ), 3 ); // Changes listened-for this way aren't coaleshed nor coalesced

  });

});
