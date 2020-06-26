
/* SCHEDULER */

const Scheduler = {

  /* VARIABLES */

  queue: new Set<Function> (),
  triggering: false,
  triggeringQueue: <Function[]> [],
  triggerTimeoutId: -1,

  /* API */

  schedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.add ( fn );

    if ( Scheduler.triggerTimeoutId !== -1 ) return;

    if ( Scheduler.triggering ) return;

    if ( !Scheduler.queue.size ) return;

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

    if ( !Scheduler.queue.size ) return;

    Scheduler.triggering = true;

    Scheduler.batch ( () => {

      while ( Scheduler.queue.size ) {

        const triggeringQueue = Array.from ( Scheduler.queue );

        Scheduler.triggeringQueue = triggeringQueue;

        Scheduler.queue.clear ();

        for ( let i = 0, l = triggeringQueue.length; i < l; i++ ) {

          triggeringQueue[i]();

        }

        Scheduler.triggeringQueue = [];

      }

    });

    Scheduler.triggering = false;

  }

};

/* EXPORT */

export default Scheduler;
