
/* IMPORT */

import {useCallback, useDebugValue, useEffect, useMemo, useRef, useState} from 'react';
import useMounted from 'react-use-mounted';
import ChangesCounters from '../changes_counters';
import {EMPTY_ARRAY, IDENTITY} from '../consts';
import onChange from '../on_change';

/* USE STORE */

function useStore<Store extends object> ( store: Store ): Store;
function useStore<Store extends object, R> ( store: Store, selector: ( store: Store ) => R, dependencies?: ReadonlyArray<any> ): R;
function useStore<Store extends object, R> ( store: Store, selector: ( store: Store ) => R = IDENTITY, dependencies: ReadonlyArray<any> = EMPTY_ARRAY ): R {

  const mounted = useMounted (),
        storeMemo = useMemo ( () => store, [store] ),
        selectorMemo = useCallback ( selector, dependencies ),
        selectorRef = useRef ( selectorMemo ), // Storing a ref so we won't have to resubscribe if the selector changes
        changesCounterRendering = useMemo ( () => ChangesCounters.get ( storeMemo ), [storeMemo] ), // Storing the number of changes at rendering time, in order to understand if changes happened before now and commit time
        [state, setState] = useState ( () => ({ value: selectorMemo ( storeMemo ) }) ); // Using an object so a re-render is triggered even if `value` is mutated (effectively remaining the same object as far as JS is concerned)

  let {value} = state;

  if ( selectorRef.current !== selectorMemo ) {

    selectorRef.current = selectorMemo;

    value = selectorMemo ( storeMemo );

    setState ({ value });

  }

  useDebugValue ( value );

  useEffect ( () => {

    if ( ChangesCounters.get ( storeMemo ) > changesCounterRendering ) { // Something changed while we weren't subscribed yet, updating

      value = selectorRef.current ( storeMemo );

      setState ({ value });

    }

    return onChange ( storeMemo, store => selectorRef.current ( store ), value => {

      if ( !mounted.current ) return;

      setState ({ value });

    });

  }, [storeMemo, changesCounterRendering] );

  return value;

}

/* EXPORT */

export default useStore;
