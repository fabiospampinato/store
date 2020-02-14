
import * as React from 'react';
import {render} from 'react-dom';
import {debug, store} from '../x';
import {useStore} from '../x/react';

debug ({
  collapsed: true,
  logStoresNew: true,
  logChangesDiff: true,
  logChangesFull: true
});

const Counter = {
  store: store ({ value: 0 }),
  increment: () => Counter.store.value += 1,
  decrement: () => Counter.store.value -= 1
};

function App () {
  const {value} = useStore ( Counter.store );
  return (
    <div>
      <div>{value}</div>
      <button onClick={Counter.increment}>Increment</button>
      <button onClick={Counter.decrement}>Decrement</button>
    </div>
  );
}

render (
  <App />,
  document.getElementById ( 'app' )
);
