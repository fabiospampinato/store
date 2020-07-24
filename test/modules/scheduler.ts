
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import Scheduler from '../../x/scheduler';

/* SCHEDULER */

describe ( 'Scheduler', it => {

  it.beforeEach ( () => {

    Scheduler.unschedule ()

    Scheduler.queue = new Set ();
    Scheduler.triggering = false;

  });

  it.serial ( 'can schedule a function for execution, avoiding duplicates', async t => {

    const calls = [];

    function fn () {
      calls.push ( 1 );
    }

    Scheduler.schedule ( fn );
    Scheduler.schedule ( fn );

    t.deepEqual ( calls, [] );

    await delay ( 100 );

    t.deepEqual ( calls, [1] );

  });

  it.serial ( 'can unschedule a function for execution', t => {

    const calls = [];

    function fn () {
      calls.push ( 1 );
    }

    Scheduler.schedule ( fn );
    Scheduler.unschedule ( fn );
    Scheduler.trigger ();

    t.deepEqual ( calls, [] );

  });

  it.serial ( 'can schedule the current queue', async t => {

    const calls = [];

    function fn () {
      calls.push ( 1 );
    }

    Scheduler.schedule ( fn );
    Scheduler.unschedule ();
    Scheduler.schedule ();

    await delay ( 100 );

    t.deepEqual ( calls, [1] );

  });

  it.serial ( 'can unschedule the current queue', async t => {

    const calls = [];

    function fn () {
      calls.push ( 1 );
    }

    Scheduler.schedule ( fn );
    Scheduler.unschedule ();

    await delay ( 100 );

    t.deepEqual ( calls, [] );

    Scheduler.trigger ();

    t.deepEqual ( calls, [1] );

  });

  it.serial ( 'can trigger execution', t => {

    const calls = [];

    function fn () {
      calls.push ( 1 );
    }

    Scheduler.schedule ( fn );
    Scheduler.unschedule ();
    Scheduler.trigger ();

    t.deepEqual ( calls, [1] );

  });

  it.serial ( 'can trigger execution of queued functions scheduled while triggering', t => {

    const calls = [];

    let rescheduled = false;

    function fn () {
      calls.push ( 1 );
      if ( rescheduled ) return;
      rescheduled = true;
      Scheduler.schedule ( fn );
    }

    Scheduler.schedule ( fn );
    Scheduler.unschedule ();
    Scheduler.trigger ();

    t.deepEqual ( calls, [1, 1] );

  });

  it.serial ( 'is not susceptible to race conditions', t => {

    const calls = [];

    function fnRemove () {
      Scheduler.unschedule ( fnAdd );
      calls.push ( 1 );
    }

    function fnAdd () {
      Scheduler.schedule ( () => {
        calls.push ( 3 );
      });
      calls.push ( 2 );
    }

    Scheduler.schedule ( fnRemove );
    Scheduler.schedule ( fnAdd );
    Scheduler.trigger ();

    t.deepEqual ( calls, [1, 2, 3] );

  });

});
