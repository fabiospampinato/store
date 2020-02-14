
/* IMPORT */

import {describe} from 'ava-spec';
import {store} from '../../x';

/* STORE */

describe ( 'store', it => {

  it ( 'wraps an object in a transparent proxy', t => {

    const dataInitial = {
      foo: true,
      bar: [1, 2, { baz: true }]
    };

    const dataFinal = {
      foo: true,
      bar: [1, 2, { baz: true, qux: 'str' }, 3],
      baz: true
    };

    const proxy = store ( dataInitial );

    t.false ( dataInitial === proxy );
    t.deepEqual ( dataInitial, proxy );

    proxy['baz'] = true;
    proxy.bar.push ( 3 );
    proxy.bar[2]['qux'] = 'str';

    t.deepEqual ( dataInitial, proxy );
    t.deepEqual ( dataFinal, proxy );

  });

});
