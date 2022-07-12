import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const instance = createInstance({
  urlBase: 'https://piwik.freseniusmedicalcare.com/',
  siteId: 95,
  userId: undefined, // optional, default value: `undefined`.
  trackerUrl: 'https://piwik.freseniusmedicalcare.com/matomo.php', // optional, default value: `${urlBase}matomo.php`
  srcUrl: 'https://piwik.freseniusmedicalcare.com/matomo.js', // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10, // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST',
  },
});

console.log(instance)

render(
  <MatomoProvider value={instance}>
    <App />
  </MatomoProvider>,
  document.getElementById('root')
);
