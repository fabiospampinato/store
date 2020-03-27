
/* IMPORT */

import {describe} from 'ava-spec';
import {useStore, useStores} from '../../x/react';

/* USE STORES */

describe ( 'useStores', it => {

  it ( 'is an alias for useStore', t => {

    t.is ( useStores, useStore );

  });

});
