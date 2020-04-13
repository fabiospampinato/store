
/* STATE */

let counter = 0,
    queue: Set<Function> = new Set ();

/* BATCH */

function batch<P extends Promise<any>> ( fn: () => P ): P {

  batch.start ();

  const promise = fn ();

  promise.then ( batch.stop, batch.stop );

  return promise;

}

/* IS BATCHING */

batch.isActive = function (): boolean {

  return !!counter;

};

/* START */

batch.start = function (): void {

  counter++;

};

/* STOP */

batch.stop = function (): void {

  counter = Math.max ( 0, counter - 1 );

  if ( counter || !queue.size ) return;

  const fns = [...queue];

  queue.clear ();

  fns.forEach ( fn => fn () );

};

/* SCHEDULE */

batch.schedule = function ( fn: Function ): void {

  queue.add ( fn );

};

/* EXPORT */

export default batch;
