
/* IMPORT */

import {describe} from 'ava-spec';
import {store} from '../../x';
import ChangesSubscriber from '../../x/changes_subscriber';
import ChangesSubscribers from '../../x/changes_subscribers';

/* CHANGES SUBSCRIBERS */

describe ( 'ChangesSubscribers', it => {

  it ( 'retrieves the ChangeSubscriber for each store', t => {

    const proxy = store ( {} ),
          changes = ChangesSubscribers.get ( proxy );

    t.true ( changes instanceof ChangesSubscriber );

  });

  it ( 'throws if no ChangeSubscriber has been found ', t => {

    t.throws ( () => ChangesSubscribers.get ( {} ), /garbage-collected/i );

  });

});
