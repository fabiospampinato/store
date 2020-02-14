
/* IMPORT */

const {store, onChange} = require ( '../x' ),
      {default: Scheduler} = require ( '../x/scheduler' ),
      {OBJ, NOOP, SELECTOR} = require ( './fixtures' ),
      benchmark = require ( 'benchloop' );

Scheduler.schedule = Scheduler.trigger;

/* BENCHMARK */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 5000,
  log: 'compact'
});

benchmark ({
  name: 'store',
  fn: () => {
    store ( OBJ () );
  }
});

benchmark ({
  name: 'onChange:register:all',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
  },
  fn: ctx => {
    onChange ( ctx.proxy, NOOP );
  }
});

benchmark ({
  name: 'onChange:register:selector',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
  },
  fn: ctx => {
    onChange ( ctx.proxy, SELECTOR, NOOP );
  }
});

benchmark ({
  name: 'onChange:trigger:all:no',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
    onChange ( ctx.proxy, NOOP );
  },
  fn: ctx => {
    ctx.proxy.foo = 123;
  }
});

benchmark ({
  name: 'onChange:trigger:all:yes',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
    onChange ( ctx.proxy, NOOP );
  },
  fn: ctx => {
    ctx.proxy.foo = 1234;
  }
});

benchmark ({
  name: 'onChange:trigger:selector:no',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
    onChange ( ctx.proxy, SELECTOR, NOOP );
  },
  fn: ctx => {
    ctx.proxy.bar.deep = true;
  }
});

benchmark ({
  name: 'onChange:trigger:selector:yes',
  beforeEach: ctx => {
    ctx.proxy = store ( OBJ () );
    onChange ( ctx.proxy, SELECTOR, NOOP );
  },
  fn: ctx => {
    ctx.proxy.bar.deep = false;
  }
});

benchmark.summary ();
