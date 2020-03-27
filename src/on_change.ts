
/* IMPORT */

import areShallowEqual from 'are-shallow-equal';
import {record, isProxy} from 'proxy-watcher';
import {EMPTY_ARRAY, SELECTOR_IDENTITY} from './consts';
import ChangesSubscribers from './changes_subscribers';
import Scheduler from './scheduler';
import Utils from './utils';
import {Disposer, ChangeListener} from './types';

/* ON CHANGE */

function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, S9 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9], listener: ChangeListener<[S1, S2, S3, S4, S5, S6, S7, S8, S9]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8], listener: ChangeListener<[S1, S2, S3, S4, S5, S6, S7, S8]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7], listener: ChangeListener<[S1, S2, S3, S4, S5, S6, S7]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object> ( stores: [S1, S2, S3, S4, S5, S6], listener: ChangeListener<[S1, S2, S3, S4, S5, S6]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object> ( stores: [S1, S2, S3, S4, S5], listener: ChangeListener<[S1, S2, S3, S4, S5]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object> ( stores: [S1, S2, S3, S4], listener: ChangeListener<[S1, S2, S3, S4]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object> ( stores: [S1, S2, S3], listener: ChangeListener<[S1, S2, S3]> ): Disposer;
function onChange<S1 extends object, S2 extends object> ( stores: [S1, S2], listener: ChangeListener<[S1, S2]> ): Disposer;
function onChange<S1 extends object> ( store: S1, listener: ChangeListener<[S1]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, S9 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6], selector: ( ...stores: [S1, S2, S3, S4, S5, S6] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, R> ( stores: [S1, S2, S3, S4, S5], selector: ( ...stores: [S1, S2, S3, S4, S5] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, S4 extends object, R> ( stores: [S1, S2, S3, S4], selector: ( ...stores: [S1, S2, S3, S4] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, S3 extends object, R> ( stores: [S1, S2, S3], selector: ( ...stores: [S1, S2, S3] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, S2 extends object, R> ( stores: [S1, S2], selector: ( ...stores: [S1, S2] ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<S1 extends object, R> ( store: S1, selector: ( store: S1 ) => R, listener: ChangeListener<[R]> ): Disposer;
function onChange<Store extends object, R> ( store: Store | Store[], selector: (( store: Store ) => R) | (( ...stores: Store[] ) => R), listener?: ChangeListener<[R] | Store[]> ): Disposer {

  if ( !listener ) return onChange ( store, SELECTOR_IDENTITY, selector );

  const stores: Store[] = Array.isArray ( store ) && !isProxy ( store ) ? store : [store] as Store[], //TSC
        storesNr = stores.length,
        disposers: Disposer[] = [];

  let rootsChangeAllCache: Map<Store, string[]> = new Map ();

  const handler = () => {

    const rootsChangeAll = rootsChangeAllCache;

    rootsChangeAllCache = new Map ();

    if ( selector === SELECTOR_IDENTITY ) return listener.apply ( undefined, stores );

    let data;

    const rootsGetAll = record ( stores, () => data = selector.apply ( undefined, stores ) ) as unknown as Map<any, string[]>, //TSC
          isDataIdentity = ( storesNr === 1 ) ? data === stores[0] : areShallowEqual ( data, stores );

    if ( isDataIdentity ) return listener.apply ( undefined, stores );

    const isDataStore = stores.indexOf ( data ) >= 0;

    if ( isDataStore && rootsChangeAll.get ( data )!.length ) return listener ( data ); //TSC

    const isSimpleSelector = Array.from ( rootsGetAll.values () ).every ( paths => !paths.length );

    if ( isSimpleSelector ) return listener ( data );

    for ( let i = 0; i < storesNr; i++ ) {

      const store = stores[i],
            rootsGet = rootsGetAll.get ( store ) || EMPTY_ARRAY,
            rootsChange = rootsChangeAll.get ( store ) || EMPTY_ARRAY,
            changed = Utils.uniq ( rootsGet ).some ( rootGet => rootsChange.indexOf ( rootGet ) >= 0 );

      if ( changed ) return listener ( data );

    }

  };

  for ( let i = 0; i < storesNr; i++ ) {

    const store = stores[i],
          changes = ChangesSubscribers.get ( store );

    const disposer = changes.subscribe ( rootsChange => {

      rootsChangeAllCache.set ( store, rootsChange );

      if ( storesNr === 1 ) return handler ();

      return Scheduler.schedule ( handler );

    });

    disposers.push ( disposer );

  }

  return () => disposers.forEach ( disposer => disposer () );

}

/* EXPORT */

export default onChange;
