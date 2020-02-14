
/* IMPORT */

import {unstable_batchedUpdates} from 'react-dom'; //TODO: Add support for react-native
import Scheduler from '../scheduler';

/* PATCH */

const {batch} = Scheduler;

Scheduler.batch = ( fn: Function ) => unstable_batchedUpdates ( () => batch ( fn ) );
