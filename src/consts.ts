
/* CONSTS */

const EMPTY_ARRAY = [];

const COMPARATOR_FALSE = () => false;

const SELECTOR_IDENTITY = ( ...args ) => args.length > 1 ? args : args[0];

const NOOP = () => {};

/* EXPORT */

export {EMPTY_ARRAY, COMPARATOR_FALSE, SELECTOR_IDENTITY, NOOP};
