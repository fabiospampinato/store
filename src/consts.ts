
/* CONSTS */

const EMPTY_ARRAY = [];

const COMPARATOR_FALSE = () => false;

const GLOBAL = ( typeof window === 'object' ? window : global );

const SELECTOR_IDENTITY = ( ...args ) => args.length > 1 ? args : args[0];

const NOOP = () => {};

/* EXPORT */

export {EMPTY_ARRAY, COMPARATOR_FALSE, GLOBAL, SELECTOR_IDENTITY, NOOP};
