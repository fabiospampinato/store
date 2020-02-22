
/* IMPORT */

import ChangesSubscriber from './changes_subscriber';
import {Store} from './types';

/* CHANGES SUBSCRIBERS */

const ChangesSubscribers = {

  /* VARIABLES */

  subscribers: new WeakMap<Store, ChangesSubscriber> (),

  /* API */

  get: ( store: Store ): ChangesSubscriber => {

    const subscriber = ChangesSubscribers.subscribers.get ( store );

    if ( !subscriber ) throw new Error ( 'Store not found, it either got garbage-collected (you must keep a reference to it) or you are passing "store" a non-proxied store somewhere' );

    return subscriber;

  },

  set: ( store: Store, subscriber: ChangesSubscriber ): void => {

    ChangesSubscribers.subscribers.set ( store, subscriber );

  }

};

/* EXPORT */

export default ChangesSubscribers;
