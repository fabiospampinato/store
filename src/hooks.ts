
/* IMPORT */

import Subscriber from './subscriber';
import {Store} from './types';

/* HOOKS */

const Hooks = {

  store: {

    change: new Subscriber<[Store, string[]]> (),

    changeBatch: new Subscriber<[Store, string[], string[]]> (),

    new: new Subscriber<[Store]> ()

  }

};

/* EXPORT */

export default Hooks;
