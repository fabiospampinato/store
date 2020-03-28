
/* IMPORT */

import ChangesSubscribers from './changes_subscribers';

/* IS STORE */

function isStore ( value: any ): boolean {

  return !!ChangesSubscribers.get ( value );

}

/* EXPORT */

export default isStore;
