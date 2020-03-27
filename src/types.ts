
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

type Store<S extends object = object> = S;

type ChangeListener<Args extends any[]> = ( ...args: Args ) => any;

type SubscriberListener<Args extends any[] = []> = ( ...args: Args ) => any;

/* EXPORT */

export {DebugGlobal, DebugOptions, Disposer, Store, ChangeListener, SubscriberListener};
