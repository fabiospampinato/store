
/* IMPORT */

import Hooks from './hooks';
import {Store} from './types';

/* CHANGES COUNTERS */

const ChangesCounters = {

  /* VARIABLES */

  counters: new WeakMap<Store, number> (),

  /* API */

  get: ( store: Store ): number => {

    return ChangesCounters.counters.get ( store ) || 0;

  },

  getMultiple: ( stores: Store[] ): number[] => {

    return stores.map ( ChangesCounters.get );

  },

  increment: ( store: Store ): void => {

    ChangesCounters.counters.set ( store, ChangesCounters.get ( store ) + 1 );

  }

};

/* INIT */

Hooks.store.change.subscribe ( ChangesCounters.increment );

/* EXPORT */

export default ChangesCounters;
