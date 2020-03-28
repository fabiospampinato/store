
/* IMPORT */

import {isProxy} from 'proxy-watcher';
import {Store} from './types';

/* UTILS */

const Utils = {

  isEqual: ( x: any[], y: any[] ): boolean => {

    if ( x.length !== y.length ) return false;

    for ( let i = 0, l = x.length; i < l; i++ ) {

      if ( x[i] !== y[i] ) return false;

    }

    return true;

  },

  isStores: ( value: any ): value is Store[] => {

    return Array.isArray ( value ) && !isProxy ( value );

  },

  uniq: <T> ( arr: T[] ): T[] => {

    if ( arr.length < 2 ) return arr;

    return arr.filter ( ( ele, index, eles ) => eles.indexOf ( ele ) === index );

  },

  paths: {

    rootify: ( paths: string[] ): string[] => {

      return paths.map ( path => {

        const dotIndex = path.indexOf ( '.' );

        if ( dotIndex < 0 ) return path;

        return path.slice ( 0, dotIndex );

      });

    }

  },

  log: {

    group: ( title: string, collapsed: boolean = true, fn: Function ): void => {

      collapsed ? console.groupCollapsed ( title ) : console.group ( title );

      fn ();

      console.groupEnd ();

    }

  }

};

/* EXPORT */

export default Utils;
