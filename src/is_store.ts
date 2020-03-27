
/* IMPORT */

import ChangesSubscribers from './changes_subscribers';

/* IS STORE */

function isStore ( obj: any ): boolean {

  try {

    ChangesSubscribers.get ( obj );

    return true;

  } catch {

    return false;

  }

}

/* EXPORT */

export default isStore;
