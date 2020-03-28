
/* IMPORT */

import ChangesSubscriber from './changes_subscriber';
import {Store} from './types';

/* CHANGES SUBSCRIBERS */

const ChangesSubscribers = {

  /* VARIABLES */

  subscribers: new WeakMap<Store, ChangesSubscriber> (),

  /* API */

  get: ( store: Store ): ChangesSubscriber | undefined => {

    return ChangesSubscribers.subscribers.get ( store );

  },

  set: ( store: Store, subscriber: ChangesSubscriber ): void => {

    ChangesSubscribers.subscribers.set ( store, subscriber );

  }

};

/* EXPORT */

export default ChangesSubscribers;
