
/* IMPORT */

const {store, isStore, onChange} = require ( '../x' ),
      {default: Scheduler} = require ( '../x/scheduler' ),
      {OBJ, NOOP, SELECTOR_SINGLE, SELECTOR_MULTIPLE} = require ( './fixtures' ),
      benchmark = require ( 'benchloop' );

Scheduler.schedule = fn => fn && fn ();

/* BENCHMARK */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 7500,
  log: 'compact'
});

benchmark ({
  name: 'store',
  beforeEach: ctx => {
    ctx.obj = OBJ ();
  },
  fn: ctx => {
    store ( ctx.obj );
  }
});

benchmark.group ( 'isStore', () => {

  benchmark ({
    name: 'no',
    beforeEach: ctx => {
      ctx.obj = OBJ ();
    },
    fn: ctx => {
      isStore ( ctx.obj );
    }
  });

  benchmark ({
    name: 'yes',
    beforeEach: ctx => {
      ctx.proxy = store ( OBJ () );
    },
    fn: ctx => {
      isStore ( ctx.proxy );
    }
  });

});

benchmark.group ( 'onChange', () => {

  benchmark.group ( 'register', () => {

    benchmark.group ( 'single', () => {

      benchmark ({
        name: 'all',
        beforeEach: ctx => {
          ctx.proxy = store ( OBJ () );
        },
        fn: ctx => {
          onChange ( ctx.proxy, NOOP );
        }
      });

      benchmark ({
        name: 'selector',
        beforeEach: ctx => {
          ctx.proxy = store ( OBJ () );
        },
        fn: ctx => {
          onChange ( ctx.proxy, SELECTOR_SINGLE, NOOP );
        }
      });

    });

    benchmark.group ( 'multiple', () => {

      benchmark ({
        name: 'all',
        beforeEach: ctx => {
          ctx.proxy1 = store ( OBJ () );
          ctx.proxy2 = store ( OBJ () );
        },
        fn: ctx => {
          onChange ( [ctx.proxy1, ctx.proxy2], NOOP );
        }
      });

      benchmark ({
        name: 'selector',
        beforeEach: ctx => {
          ctx.proxy1 = store ( OBJ () );
          ctx.proxy2 = store ( OBJ () );
        },
        fn: ctx => {
          onChange ( [ctx.proxy1, ctx.proxy2], SELECTOR_MULTIPLE, NOOP );
        }
      });

    });

  });

  benchmark.group ( 'trigger', () => {

    benchmark.group ( 'single', () => {

      benchmark.group ( 'all', () => {

        benchmark ({
          name: 'no',
          beforeEach: ctx => {
            ctx.proxy = store ( OBJ () );
            onChange ( ctx.proxy, NOOP );
          },
          fn: ctx => {
            ctx.proxy.foo = 123;
          }
        });

        benchmark ({
          name: 'yes',
          beforeEach: ctx => {
            ctx.proxy = store ( OBJ () );
            onChange ( ctx.proxy, NOOP );
          },
          fn: ctx => {
            ctx.proxy.foo = 1234;
          }
        });

      });

      benchmark.group ( 'selector', () => {

        benchmark ({
          name: 'no',
          beforeEach: ctx => {
            ctx.proxy = store ( OBJ () );
            onChange ( ctx.proxy, SELECTOR_SINGLE, NOOP );
          },
          fn: ctx => {
            ctx.proxy.bar.deep = true;
          }
        });

        benchmark ({
          name: 'yes',
          beforeEach: ctx => {
            ctx.proxy = store ( OBJ () );
            onChange ( ctx.proxy, SELECTOR_SINGLE, NOOP );
          },
          fn: ctx => {
            ctx.proxy.bar.deep = false;
          }
        });

      });

    });

    benchmark.group ( 'multiple', () => {

      benchmark.group ( 'all', () => {

        benchmark ({
          name: 'no',
          beforeEach: ctx => {
            ctx.proxy1 = store ( OBJ () );
            ctx.proxy2 = store ( OBJ () );
            onChange ( [ctx.proxy1, ctx.proxy2], NOOP );
          },
          fn: ctx => {
            ctx.proxy1.foo = 123;
            ctx.proxy2.foo = 123;
          }
        });

        benchmark ({
          name: 'yes',
          beforeEach: ctx => {
            ctx.proxy1 = store ( OBJ () );
            ctx.proxy2 = store ( OBJ () );
            onChange ( [ctx.proxy1, ctx.proxy2], NOOP );
          },
          fn: ctx => {
            ctx.proxy1.foo = 1234;
            ctx.proxy2.foo = 1234;
          }
        });

      });

      benchmark.group ( 'selector', () => {

        benchmark ({
          name: 'no',
          beforeEach: ctx => {
            ctx.proxy1 = store ( OBJ () );
            ctx.proxy2 = store ( OBJ () );
            onChange ( [ctx.proxy1, ctx.proxy2], SELECTOR_MULTIPLE, NOOP );
          },
          fn: ctx => {
            ctx.proxy1.bar.deep = true;
            ctx.proxy2.bar.deep = true;
          }
        });

        benchmark ({
          name: 'yes',
          beforeEach: ctx => {
            ctx.proxy1 = store ( OBJ () );
            ctx.proxy2 = store ( OBJ () );
            onChange ( [ctx.proxy1, ctx.proxy2], SELECTOR_MULTIPLE, NOOP );
          },
          fn: ctx => {
            ctx.proxy1.bar.deep = false;
            ctx.proxy2.bar.deep = false;
          }
        });

      });

    });

  });

});

benchmark.summary ();
