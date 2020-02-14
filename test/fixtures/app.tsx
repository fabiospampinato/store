
/* IMPORT */

import * as React from 'react';
import {store} from '../../x';
import {useStore} from '../../x/react';

/* APP */

const API = {
  store: store ({ value: 0 }),
  increment: () => API.store.value++,
  decrement: () => API.store.value--
};

const AppNoSelector = ({ rendering }) => {
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

const AppSelector = ({ rendering }) => {
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

/* EXPORT */

export {API, AppNoSelector, AppSelector};
