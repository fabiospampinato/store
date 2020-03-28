
/* IMPORT */

import {NOOP} from './consts';
import Scheduler from './scheduler';
import {Disposer, Listener} from './types';

/* SUBSCRIBER */

class Subscriber<ListenerArgs extends any[] = []> {

  /* VARIABLES */

  protected args: ListenerArgs | undefined = undefined;
  protected listeners: Listener<ListenerArgs>[] = [];
  protected _trigger = this.trigger.bind ( this );

  /* API */

  subscribe ( listener: Listener<ListenerArgs> ): Disposer {

    if ( this.listeners.indexOf ( listener ) >= 0 ) return NOOP;

    this.listeners.push ( listener );

    return () => {

      this.listeners = this.listeners.filter ( l => l !== listener );

    };

  }

  schedule ( ...args: any[] ): void { // When scheduling arguments have to be provided via the `args` instance variable

    return Scheduler.schedule ( this._trigger );

  }

  trigger ( ...args: ListenerArgs ): void {

    const {listeners} = this,
          {length} = listeners;

    for ( let i = 0; i < length; i++ ) {

      listeners[i].apply ( undefined, args );

    }

  }

}

/* EXPORT */

export default Subscriber;
