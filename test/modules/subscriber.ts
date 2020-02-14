
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import Subscriber from '../../x/subscriber';

/* SUBSCRIBER */

describe ( 'Subscriber', it => {

  it ( 'can add a listener, avoiding duplicates', t => {

    const subscriber = new Subscriber (),
          calls = [];

    function listener () {
      calls.push ( 1 );
    }

    subscriber.subscribe ( listener );
    subscriber.subscribe ( listener );
    subscriber.trigger ();

    t.deepEqual ( calls, [1] );

  });

  it ( 'can remove a listener', t => {

    const subscriber = new Subscriber (),
          calls = [];

    function listener () {
      calls.push ( 1 );
    }

    subscriber.subscribe ( listener )();
    subscriber.subscribe ( listener )();
    subscriber.trigger ();

    t.deepEqual ( calls, [] );

  });

  it ( 'can trigger the listeners', t => {

    const subscriber = new Subscriber (),
          calls = [];

    function listener () {
      calls.push ( 1 );
    }

    subscriber.trigger ();
    subscriber.subscribe ( listener );
    subscriber.trigger ();
    subscriber.trigger ();

    t.deepEqual ( calls, [1, 1] );

  });

  it ( 'is not susceptible to race conditions', t => {

    const subscriber = new Subscriber (),
          calls = [];

    const listenerRemoveDisposer = subscriber.subscribe ( function listenerRemove () {
      listenerAddDisposer ();
      calls.push ( 1 );
    });

    const listenerAddDisposer = subscriber.subscribe ( function listenerAdd () {
      subscriber.subscribe ( () => {
        calls.push ( 3 );
      });
      calls.push ( 2 );
    });

    subscriber.trigger ();

    t.deepEqual ( calls, [1, 2] );

    subscriber.trigger ();

    t.deepEqual ( calls, [1, 2, 1, 3] );

  });

  it ( 'can schedule execution', async t => {

    const subscriber = new Subscriber (),
          calls = [];

    function listener () {
      calls.push ( 1 );
    }

    subscriber.subscribe ( listener );

    await delay ( 10 );

    t.deepEqual ( calls, [] );

    subscriber.schedule ();

    await delay ( 10 );

    t.deepEqual ( calls, [1] );

  });

  it ( 'will pass to the listeners either the trigger arguments or the instance arguments', t => {

    const subscriber = new Subscriber (),
          calls = [],
          args = [];

    function listener () {
      calls.push ( 1 );
      args.push ( ...arguments );
    }

    subscriber.subscribe ( listener );

    t.deepEqual ( calls, [] );
    t.deepEqual ( args, [] );

    subscriber.trigger ();

    t.deepEqual ( calls, [1] );
    t.deepEqual ( args, [] );

    subscriber.trigger ( 'a' );

    t.deepEqual ( calls, [1, 1] );
    t.deepEqual ( args, ['a'] );

    subscriber.args = ['i'];
    subscriber.trigger ( 'a' );

    t.deepEqual ( calls, [1, 1, 1] );
    t.deepEqual ( args, ['a', 'a'] );

    subscriber.trigger ();

    t.deepEqual ( calls, [1, 1, 1, 1] );
    t.deepEqual ( args, ['a', 'a', 'i'] );

  });

});
