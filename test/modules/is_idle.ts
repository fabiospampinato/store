
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {isIdle, onChange, store} from '../../x';

/* IS IDLE */

describe ( 'isIdle', it => {

  it.serial ( 'detects when there are pending changes', async t => {

    const proxy1 = store ({ foo: false }),
          proxy2 = store ({ foo: false });

    t.true ( isIdle () );
    t.true ( isIdle ( proxy1 ) );
    t.true ( isIdle ( proxy2 ) );

    proxy1.foo = true;

    t.false ( isIdle () );
    t.false ( isIdle ( proxy1 ) );
    t.true ( isIdle ( proxy2 ) );

    await delay ( 100 );

    t.true ( isIdle () );
    t.true ( isIdle ( proxy1 ) );
    t.true ( isIdle ( proxy2 ) );

  });

  it.serial ( 'detects when triggering changes', async t => {

    t.plan ( 6 );

    const proxy1 = store ( { foo: false } ),
          proxy2 = store ( { foo: false } );

    onChange ( proxy1, () => {

      t.false ( isIdle () );
      t.false ( isIdle ( proxy1 ) );
      t.true ( isIdle ( proxy2 ) );

    });

    proxy1.foo = true;

    await delay ( 100 );

    t.true ( isIdle () );
    t.true ( isIdle ( proxy1 ) );
    t.true ( isIdle ( proxy2 ) );

  });

});
