
/* SCHEDULER */

const Scheduler = {

  /* VARIABLES */

  queue: new Set<Function> (),
  triggering: false,
  triggeringQueue: <Function[]> [],
  triggerId: -1 as any, //TSC
  triggerClear: typeof clearImmediate === 'function' ? clearImmediate : clearTimeout,
  triggerSet: typeof setImmediate === 'function' ? setImmediate : setTimeout,

  /* API */

  schedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.add ( fn );

    if ( Scheduler.triggerId !== -1 ) return;

    if ( Scheduler.triggering ) return;

    if ( !Scheduler.queue.size ) return;

    Scheduler.triggerId = Scheduler.triggerSet ( () => {

      Scheduler.triggerId = -1;

      Scheduler.trigger  ();

    }, 0 );

  },

  unschedule: ( fn?: Function ): void => {

    if ( fn ) Scheduler.queue.delete ( fn );

    if ( Scheduler.triggerId === -1 ) return;

    Scheduler.triggerClear ( Scheduler.triggerId );

    Scheduler.triggerId = -1;

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
