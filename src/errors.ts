
/* ERRORS */

const Errors = {

  storeNotFound: (): Error => {

    return new Error ( 'Store not found, it either got garbage-collected (you must keep a reference to it) or you are passing "store" a non-proxied store somewhere' );

  },

  storesEmpty: (): Error => {

    return new Error ( 'An empty array of stores has been provided, you need to provide at least one store' );

  }

};

/* EXPORT */

export default Errors;
