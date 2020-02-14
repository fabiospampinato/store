
/* IMPORT */

import {$GET_RECORD_START, $GET_RECORD_STOP} from 'proxy-watcher/dist/consts'; //UGLY
import {IDENTITY} from './consts';
import ChangesSubscribers from './changes_subscribers';
import Utils from './utils';
import {Disposer, ChangeListener} from './types';

/* ON CHANGE */

function onChange<Store extends object> ( store: Store, listener: ChangeListener<Store> ): Disposer;
function onChange<Store extends object, R> ( store: Store, selector: ( store: Store ) => R, listener: ChangeListener<R> ): Disposer;
function onChange<Store extends object, R> ( store: Store, selector: (( store: Store ) => R) | ChangeListener<Store>, listener?: ChangeListener<R | Store> ): Disposer {

  if ( !listener ) return onChange ( store, IDENTITY, selector );

  const changes = ChangesSubscribers.get ( store );

  return changes.subscribe ( rootsChange => {

    if ( selector === IDENTITY ) return listener ( store );

    store[$GET_RECORD_START];

    const data = selector ( store ),
          rootsGetAll: string[] = store[$GET_RECORD_STOP];

    if ( data === store || !rootsGetAll.length ) return listener ( data );

    const rootsGet = Utils.uniq ( rootsGetAll ),
          changed = rootsGet.some ( get => rootsChange.includes ( get ) );

    if ( !changed ) return;

    return listener ( data );

  });

}

/* EXPORT */

export default onChange;
