
/* IMPORT */

import {EMPTY_ARRAY} from './consts';
import Subscriber from './subscriber';
import Utils from './utils';

/* CHANGES SUBSCRIBER */

class ChangesSubscriber extends Subscriber<[string[]]> {

  /* VARIABLES */

  protected paths: string[] | undefined;

  /* API */

  schedule ( paths: string[] ): void {

    this.paths = this.paths ? this.paths.concat ( paths ) : paths;

    return super.schedule ();

  }

  trigger (): void {

    const paths = this.paths || EMPTY_ARRAY,
          roots = Utils.uniq ( Utils.paths.rootify ( paths ) );

    this.paths = undefined;

    super.trigger ( roots );

  }

}

/* EXPORT */

export default ChangesSubscriber;
