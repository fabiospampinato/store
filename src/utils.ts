
/* UTILS */

const Utils = {

  uniq: <T> ( arr: T[] ): T[] => {

    return arr.filter ( ( ele, index, eles ) => eles.indexOf ( ele ) === index );

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
