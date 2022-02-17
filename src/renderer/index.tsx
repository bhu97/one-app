import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const instance = createInstance({
  urlBase: 'https://piwik.freseniusmedicalcare.com/',
  siteId: 95,
});



render(
  <MatomoProvider value={instance}>
    <App />
  </MatomoProvider>,
  document.getElementById('root')
);
