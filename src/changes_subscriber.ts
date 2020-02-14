
/* IMPORT */

import Subscriber from './subscriber';
import Utils from './utils';

/* CHANGES SUBSCRIBER */

class ChangesSubscriber extends Subscriber<[string[]]> {

  /* VARIABLES */

  protected paths: string[] = [];

  /* API */

  schedule ( paths: string[] ): void {

    this.paths = this.paths.concat ( paths );

    return super.schedule ();

  }

  trigger (): void {

    const roots = Utils.uniq ( this.paths.map ( path => path.replace ( /^(.+?)\..*$/, '$1' ) ) );

    this.args = [roots];

    super.trigger.apply ( this, arguments );

    this.paths = [];
    this.args=[this.paths];

  }

}

/* EXPORT */

export default ChangesSubscriber;
