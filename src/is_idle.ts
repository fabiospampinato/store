

/* IMPORT */

import ChangesSubscribers from './changes_subscribers';
import Errors from './errors';
import Scheduler from './scheduler';

/* IS IDLE */

function isIdle<Store extends object> ( store?: Store ): boolean {

  if ( store ) {

    const changes = ChangesSubscribers.get ( store );

    if ( !changes ) throw Errors.storeNotFound ();

    return !Scheduler.queue.has ( changes['_trigger'] ) && !Scheduler.triggeringQueue.has ( changes['_trigger'] );

  } else {

    return !Scheduler.triggering && !Scheduler.queue.size;

  }

}

/* EXPORT */

export default isIdle;
