
/* IMPORT */

import areShallowEqual from 'are-shallow-equal';
import {useCallback, useDebugValue, useEffect, useMemo, useRef, useState} from 'react';
import ChangesCounters from '../changes_counters';
import {EMPTY_ARRAY, COMPARATOR_FALSE, SELECTOR_IDENTITY} from '../consts';
import Errors from '../errors';
import onChange from '../on_change';
import Utils from '../utils';
import {Primitive} from '../types';

/* USE STORE */

function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, S9 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9] ): [S1, S2, S3, S4, S5, S6, S7, S8, S9];
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8] ): [S1, S2, S3, S4, S5, S6, S7, S8];
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object> ( stores: [S1, S2, S3, S4, S5, S6, S7] ): [S1, S2, S3, S4, S5, S6, S7];
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object> ( stores: [S1, S2, S3, S4, S5, S6] ): [S1, S2, S3, S4, S5, S6];
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object> ( stores: [S1, S2, S3, S4, S5] ): [S1, S2, S3, S4, S5];
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object> ( stores: [S1, S2, S3, S4] ): [S1, S2, S3, S4];
function useStore<S1 extends object, S2 extends object, S3 extends object> ( stores: [S1, S2, S3] ): [S1, S2, S3];
function useStore<S1 extends object, S2 extends object> ( stores: [S1, S2] ): [S1, S2];
function useStore<S1 extends object> ( store: S1 ): S1;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, S9 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6], selector: ( ...stores: [S1, S2, S3, S4, S5, S6] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, R> ( stores: [S1, S2, S3, S4, S5], selector: ( ...stores: [S1, S2, S3, S4, S5] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, R> ( stores: [S1, S2, S3, S4], selector: ( ...stores: [S1, S2, S3, S4] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, R> ( stores: [S1, S2, S3], selector: ( ...stores: [S1, S2, S3] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, R> ( stores: [S1, S2], selector: ( ...stores: [S1, S2] ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, R> ( store: S1, selector: ( store: S1 ) => R, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, S9 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8, S9] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, S8 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7, S8], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7, S8] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, S7 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6, S7], selector: ( ...stores: [S1, S2, S3, S4, S5, S6, S7] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, S6 extends object, R> ( stores: [S1, S2, S3, S4, S5, S6], selector: ( ...stores: [S1, S2, S3, S4, S5, S6] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, S5 extends object, R> ( stores: [S1, S2, S3, S4, S5], selector: ( ...stores: [S1, S2, S3, S4, S5] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, S4 extends object, R> ( stores: [S1, S2, S3, S4], selector: ( ...stores: [S1, S2, S3, S4] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, S3 extends object, R> ( stores: [S1, S2, S3], selector: ( ...stores: [S1, S2, S3] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, S2 extends object, R> ( stores: [S1, S2], selector: ( ...stores: [S1, S2] ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<S1 extends object, R> ( store: S1, selector: ( store: S1 ) => R, comparator: ( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean, dependencies?: any[] ): R;
function useStore<Store extends object, R> ( store: Store | Store[], selector: (( store: Store ) => R) | (( ...stores: Store[] ) => R) = SELECTOR_IDENTITY, comparator?: (( dataPrev: Exclude<R, Primitive>, dataNext: Exclude<R, Primitive> ) => boolean) | any[], dependencies?: any[] ): Store | Store[] | R {

  if ( !dependencies && !comparator ) return useStore ( store, selector, COMPARATOR_FALSE, EMPTY_ARRAY );

  if ( !dependencies ) {

    if ( typeof comparator === 'function' ) return useStore ( store, selector, comparator, EMPTY_ARRAY );

    return useStore ( store, selector, COMPARATOR_FALSE, comparator );

  }

  const stores = Utils.isStores ( store ) ? store : [store];

  if ( !stores.length ) throw Errors.storesEmpty ();

  const mountedRef = useRef ( false ),
        storesRef = useRef<Store[] | undefined> (),
        storesMemo = ( storesRef.current && areShallowEqual ( storesRef.current, stores ) ) ? storesRef.current : stores,
        selectorMemo = useCallback ( selector, dependencies ),
        selectorRef = useRef ( selectorMemo ), // Storing a ref so we won't have to resubscribe if the selector changes
        comparatorMemo = useCallback ( comparator as any, dependencies ), //TSC
        comparatorRef = useRef ( comparatorMemo ), // Storing a ref so we won't have to resubscribe if the comparator changes
        changesCountersRendering = useMemo ( () => ChangesCounters.getMultiple ( storesMemo ), [storesMemo] ), // Storing the number of changes at rendering time, in order to understand if changes happened before now and commit time
        valueRef = useRef<R> ( undefined as any ), // Using a ref in order not to trigger *any* unnecessary re-renders //TSC
        setUpdateId = useState<symbol> ()[1], // Dummy state used for triggering updates
        forceUpdate = useCallback ( () => setUpdateId ( Symbol () ), [] );

  if ( storesRef.current !== storesMemo || selectorRef.current !== selectorMemo || comparatorRef.current !== comparatorMemo ) {

    storesRef.current = storesMemo;
    selectorRef.current = selectorMemo;
    comparatorRef.current = comparatorMemo;

    const value = selectorMemo.apply ( undefined, storesMemo );

    if ( !Object.is ( value, valueRef.current ) ) {

      valueRef.current = value;

    }

  }

  useDebugValue ( valueRef.current );

  useEffect ( () => {

    mountedRef.current = true;

    return () => {

      mountedRef.current = false;

    };

  }, [] );

  useEffect ( () => {

    /* COUNTERS */ // Checking if something changed while we weren't subscribed yet, updating

    const changesCounterMounting = ChangesCounters.getMultiple ( storesMemo );

    if ( !Utils.isEqual ( changesCountersRendering, changesCounterMounting ) ) {

      const value = selectorRef.current.apply ( undefined, storesMemo );

      if ( !Object.is ( value, valueRef.current ) ) {

        valueRef.current = value;

        forceUpdate ();

      }

    }

    /* SUBSCRIPTION */

    return onChange ( storesMemo, ( ...stores ) => selectorRef.current.apply ( undefined, stores ), ( dataPrev, dataNext ) => comparatorRef.current.call ( undefined, dataPrev, dataNext ), ( ...values ) => {

      if ( !mountedRef.current ) return;

      const value = values.length > 1 ? values : values[0];

      valueRef.current = value;

      forceUpdate ();

    });

  }, [storesMemo, changesCountersRendering] );

  return valueRef.current;

}

/* EXPORT */

export default useStore;
