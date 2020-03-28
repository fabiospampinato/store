
/* FIXTURE */

const OBJ = () => ({
  foo: 123,
  bar: { deep: true },
  arr: [1, 2, '3'],
  nan: NaN
});

const NOOP = () => {};

const SELECTOR_SINGLE = obj => obj.bar;

const SELECTOR_MULTIPLE = ( o1, o2 ) => o1.foo * o2.foo;

/* EXPORT */

module.exports = {OBJ, NOOP, SELECTOR_SINGLE, SELECTOR_MULTIPLE};
