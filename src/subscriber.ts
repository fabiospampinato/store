
/* IMPORT */

import {NOOP} from './consts';
import Scheduler from './scheduler';
import {Disposer, SubscriberListener} from './types';

/* SUBSCRIBER */

class Subscriber<ListenerArgs extends any[] = []> {

  /* VARIABLES */

  protected args: ListenerArgs | undefined = undefined;
  protected listeners: SubscriberListener<ListenerArgs>[] = [];
  protected _trigger: ( ...args: ListenerArgs ) => void;

  /* CONSTRUCTOR */

  constructor () {

    this._trigger = this.trigger.bind ( this );

  }

  /* API */

  subscribe ( listener: SubscriberListener<ListenerArgs> ): Disposer {

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

    const listenerArgs = args.length ? args : this.args || args;

    this.listeners.forEach ( listener => {

      listener.apply ( undefined, listenerArgs );

    });

  }

}

/* EXPORT */

export default Subscriber;
