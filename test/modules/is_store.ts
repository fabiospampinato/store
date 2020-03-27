
/* IMPORT */

import {describe} from 'ava-spec';
import {watch} from 'proxy-watcher';
import {isStore, store} from '../../x';

/* IS STORE */

describe ( 'isStore', it => {

  it ( 'checks if the provided value is a store or not', t => {

    t.true ( isStore ( store ( {} ) ) );
    t.true ( isStore ( store ( [] ) ) );
    t.false ( isStore ( watch ( {}, () => {} )[0] ) );
    t.false ( isStore ( {} ) );
    t.false ( isStore ( [] ) );
    t.false ( isStore ( 123 ) );

  });

});
