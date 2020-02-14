
/* FIXTURE */

const OBJ = () => ({
  foo: 123,
  bar: { deep: true },
  arr: [1, 2, '3'],
  nan: NaN
});

const NOOP = () => {};

const SELECTOR = obj => obj.bar;

/* EXPORT */

module.exports = {OBJ, NOOP, SELECTOR};
