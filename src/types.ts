
/* TYPES */

type DebugGlobal = {
  stores: Store[],
  log: () => void
};

type DebugOptions = {
  collapsed: boolean,
  logStoresNew: boolean,
  logChangesDiff: boolean,
  logChangesFull: boolean
};

type Disposer = () => void;

type Listener<Args extends any[]> = ( ...args: Args ) => any;

type Store<S extends object = object> = S;

/* EXPORT */

export {DebugGlobal, DebugOptions, Disposer, Listener, Store};
