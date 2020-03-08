
/* IMPORT */

import './changes_counters';
import {watch} from 'proxy-watcher';
import ChangesSubscriber from './changes_subscriber';
import ChangesSubscribers from './changes_subscribers';
import Hooks from './hooks';

/* STORE */

function store<Store extends object> ( store: Store ): Store {

  const changes = new ChangesSubscriber ();

  const [proxy] = watch ( store, paths => {

    Hooks.store.change.trigger ( proxy, paths );

    changes.schedule ( paths );

  });

  ChangesSubscribers.set ( proxy, changes );

  Hooks.store.new.trigger ( proxy );

  return proxy;

}

/* EXPORT */

export default store;
