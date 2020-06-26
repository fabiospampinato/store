
/* SCHEDULER */

const Scheduler = {

  /* VARIABLES */

  queue: new Set<Function> (),
  triggering: false,
  triggeringQueue: new Set<Function> (),
  triggerTimeoutId: -1,

  /* API */

  schedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.add ( fn );

    if ( Scheduler.triggerTimeoutId !== -1 ) return;

    if ( Scheduler.triggering ) return;

    Scheduler.triggerTimeoutId = setTimeout ( Scheduler.trigger );

  },

  unschedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.delete ( fn );

    if ( Scheduler.triggerTimeoutId === -1 ) return;

    clearTimeout ( Scheduler.triggerTimeoutId );

    Scheduler.triggerTimeoutId = -1;

  },

  batch: ( fn: Function ): void => { // Defined for extensibility purposes

    fn ();

  },

  trigger: (): void => {

    Scheduler.unschedule ();

    if ( Scheduler.triggering ) return;

    Scheduler.triggering = true;

    Scheduler.batch ( () => {

      while ( Scheduler.queue.size ) {

        Scheduler.triggeringQueue = new Set ( Scheduler.queue );

        Scheduler.queue.clear ();

        for ( const fn of Scheduler.triggeringQueue ) fn ();

        Scheduler.triggeringQueue.clear ();

      }

    });

    Scheduler.triggering = false;

  }

};

/* EXPORT */

export default Scheduler;
