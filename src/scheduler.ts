
/* SCHEDULER */

const Scheduler = {

  /* VARIABLES */

  queue: new Set<Function> (),
  triggering: false,
  triggerTimeoutId: -1,

  /* API */

  schedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.add ( fn );

    if ( Scheduler.triggerTimeoutId !== -1 ) return;

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

    if ( Scheduler.triggering ) return Scheduler.schedule ();

    Scheduler.triggering = true;

    const fns = Scheduler.queue.values ();

    Scheduler.queue = new Set<Function> ();

    Scheduler.batch ( () => {

      for ( const fn of fns ) fn ();

    });

    Scheduler.triggering = false;

  }

};

/* EXPORT */

export default Scheduler;
