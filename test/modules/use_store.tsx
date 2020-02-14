
/* IMPORT */

import {describe} from 'ava-spec';
import * as Enzyme from 'enzyme';
import {mount} from 'enzyme';
import Adapter1 from 'enzyme-adapter-react-16'; //UGLY: For whatever reason we need to use both kinds
import * as Adapter2 from 'enzyme-adapter-react-16'; //UGLY: For whatever reason we need to use both kinds
import delay from 'promise-resolve-timeout';
import * as React from 'react';
import {API, AppNoSelector, AppSelector} from '../fixtures/app';

Enzyme.configure ({ adapter: new ( Adapter1 || Adapter2 ) () });

/* USE STORE */

describe ( 'useStore', it => {

  it.serial ( 'works', async t => {

    const Apps = [AppNoSelector, AppSelector];

    for ( const App of Apps ) {

      API.store.value = 0;

      let rendersNr = 0,
          rendering = () => rendersNr++;

      const app = mount ( React.createElement ( App, {rendering} ) ),
            getText = selector => app.find ( selector ).text (),
            getValue = () => getText ( '#value' ),
            click = selector => app.find ( selector ).simulate ( 'click' );

      t.is ( getValue (), '0' );
      t.is ( rendersNr, 1 );

      click ( '#increment' );
      click ( '#increment' );
      click ( '#increment' );

      await delay ( 10 );

      t.is ( getValue (), '3' );
      t.is ( rendersNr, 2 );

      click ( '#decrement' );

      await delay ( 10 );

      t.is ( getValue (), '2' );
      t.is ( rendersNr, 3 );

    }

  });

});
