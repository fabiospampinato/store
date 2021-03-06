
/* IMPORT */

import isEmptyObject from 'plain-object-is-empty';
import {target} from 'proxy-watcher';
import ProxyWatcherUtils from 'proxy-watcher/dist/utils';
import ChangesSubscribers from './changes_subscribers';
import {GLOBAL} from './consts';
import Errors from './errors';
import Hooks from './hooks';
import Utils from './utils';
import {DebugGlobal, DebugOptions, Store} from './types';

/* DEBUG */

const defaultOptions: DebugOptions = {
  collapsed: true,
  logStoresNew: false,
  logChangesDiff: true,
  logChangesFull: false
};

function debug ( options: Partial<DebugOptions> = {} ): DebugGlobal {

  if ( GLOBAL['STORE'] ) return GLOBAL['STORE'];

  options = Object.assign ( {}, debug.defaultOptions, options );

  const STORE = GLOBAL['STORE'] = {
    stores: [] as Store[], //FIXME: This shouldn't store a strong reference to stores, but also a WeakSet doesn't allow to retrieve all of its values...
    log: () => {
      STORE.stores.forEach ( store => {
        console.log ( ProxyWatcherUtils.cloneDeep ( target ( store ) ) );
      });
    }
  };

  Hooks.store.new.subscribe ( store => {

    STORE.stores.push ( store );

    let storePrev = ProxyWatcherUtils.cloneDeep ( target ( store ) );

    if ( options.logStoresNew ) {
      Utils.log.group ( 'Store - New', options.collapsed, () => {
        console.log ( storePrev );
      });
    }

    if ( options.logChangesFull || options.logChangesDiff ) {

      const changes = ChangesSubscribers.get ( store );

      if ( !changes ) throw Errors.storeNotFound ();

      changes.subscribe ( () => {

        const storeNext = ProxyWatcherUtils.cloneDeep ( target ( store ) );

        Utils.log.group ( `Store - Change - ${new Date ().toISOString ()}`, options.collapsed, () => {

          if ( options.logChangesDiff ) {

            const {added, updated, deleted} = ProxyWatcherUtils.diff ( storePrev, storeNext );

            if ( !isEmptyObject ( added ) ) {
              console.log ( 'Added' );
              console.log ( added );
            }

            if ( !isEmptyObject ( updated ) ) {
              console.log ( 'Updated' );
              console.log ( updated );
            }

            if ( !isEmptyObject ( deleted ) ) {
              console.log ( 'Deleted' );
              console.log ( deleted );
            }

          }

          if ( options.logChangesFull ) {
            console.log ( 'New store' );
            console.log ( storeNext );
            console.log ( 'Old store' )
            console.log ( storePrev );
          }

        });

        storePrev = storeNext;

      });

    }

  });

  return STORE;

}

debug.defaultOptions = defaultOptions;

/* EXPORT */

export default debug;
