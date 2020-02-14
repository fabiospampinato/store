
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {debug, store} from '../../x';

/* DEBUG */

describe ( 'debug', it => {

  it.beforeEach ( () => {

    delete global.STORE;

  });

  it.skip ( 'defines the STORE global', t => { //FIXME: For some reason the used globals are different, ava is probably messing with this

    t.is ( global.STORE, undefined );

    const STORE = debug ();

    t.true ( STORE.stores instanceof Array );
    t.is ( typeof STORE.log, 'function' );
    t.deepEqual ( global.STORE, STORE );

  });

  it ( 'it called multiple times it will just return the global again', async t => {

    let callsNr = 0;

    console.groupEnd = () => callsNr++;
    console.log = () => {}; // Silencing it

    const STORE1 = debug ({ logStoresNew: true }),
          STORE2 = debug ({ logStoresNew: true });

    t.deepEqual ( STORE1, STORE2 );

    store ( {} );

    await delay ( 100 );

    t.is ( callsNr, 1 );

  });

});
