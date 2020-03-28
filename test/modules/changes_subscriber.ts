
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import {store} from '../../x';
import ChangesSubscribers from '../../x/changes_subscribers';

/* CHANGES SUBSCRIBER */

describe ( 'ChangesSubscriber', it => {

  it ( 'it passes a cleaned-up array of changed root paths to the trigger', async t => {

    const proxy = store ({
      1: 1,
      2: {},
      foo: true,
      a: [1, 2, { baz: true }],
      o: {
        deep: {
          a: [1, 2, 3],
          deeper: true
        }
      }
    });

    const changes = ChangesSubscribers.get ( proxy );

    let paths = [];

    function listener ( _paths ) {
      paths = _paths;
    };

    changes.subscribe ( listener );

    proxy['1'] = 2;
    proxy['2'].foo = true;
    proxy.foo = false;
    proxy.foo = true;
    proxy.foo = true;
    proxy.a.push ( 3 );
    proxy.a.push ( 4 );
    proxy.a[2].baz = false;
    proxy.o.deep.foo = false;
    proxy.o.deep.a.push ( 4 );
    proxy.o.deep.deeper = false;

    await delay ( 100 );

    t.deepEqual ( paths, ['1', '2', 'foo', 'a', 'o'] );
    t.is ( changes.paths, undefined );

  });

});
