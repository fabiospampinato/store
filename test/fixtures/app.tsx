
/* IMPORT */

import * as React from 'react';
import {useCallback, useState} from 'react';
import {store} from '../../x';
import {useStore} from '../../x/react';

/* APP */

const API = {
  store: store ({ value: 0 }),
  increment: () => API.store.value++,
  decrement: () => API.store.value--
};

const API2 = {
  store: store ({ value: 0 }),
  increment: () => API2.store.value++,
  decrement: () => API2.store.value--
};

const AppSingleWithoutSelector = ({ rendering }) => {
  rendering ();
  const {value} = useStore ( API.store );
  return (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="increment" onClick={API.increment}>Increment</div>
      <div id="decrement" onClick={API.decrement}>Decrement</div>
    </div>
  );
};

const AppSingleWithSelector = ({ rendering }) => {
  rendering ();
  const value = useStore ( API.store, store => store.value );
  return (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="increment" onClick={API.increment}>Increment</div>
      <div id="decrement" onClick={API.decrement}>Decrement</div>
    </div>
  );
};

const AppMultipleWithoutSelector = ({ rendering }) => {
  rendering ();
  const [store1, store2] = useStore ([ API.store, API2.store ]);
  return (
    <div id="counter">
      <div id="value">{store1.value * store2.value}</div>
      <div id="one-increment" onClick={API.increment}>Increment</div>
      <div id="one-decrement" onClick={API.decrement}>Decrement</div>
      <div id="two-increment" onClick={API2.increment}>Increment</div>
      <div id="two-decrement" onClick={API2.decrement}>Decrement</div>
    </div>
  );
};

const AppMultipleWithSelector = ({ rendering }) => {
  rendering ();
  const value = useStore ( [API.store, API2.store], ( store1, store2 ) => store1.value * store2.value );
  return (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="one-increment" onClick={API.increment}>Increment</div>
      <div id="one-decrement" onClick={API.decrement}>Decrement</div>
      <div id="two-increment" onClick={API2.increment}>Increment</div>
      <div id="two-decrement" onClick={API2.decrement}>Decrement</div>
    </div>
  );
};

const SWAP1 = store ({ value: 0 });
const SWAP2 = store ({ value: 100 });

const AppWithSwappedStore = ({ rendering }) => {
  rendering ();
  const [store, setStore] = useState ( SWAP1 );
  const value = useStore ( store, store => store.value );
  const swap = useCallback ( () => setStore ( SWAP2 ), [] );
  return (
    <div id="counter">
      <div id="value">{value}</div>
      <div id="swap" onClick={swap}>Swap</div>
    </div>
  );
};

/* EXPORT */

export {API, API2, SWAP1, SWAP2, AppSingleWithoutSelector, AppSingleWithSelector, AppMultipleWithoutSelector, AppMultipleWithSelector, AppWithSwappedStore};
