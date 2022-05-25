import './App.global.css';
import './utils/global';

import React, { useEffect } from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { LoadingDialog, UpdateMetadataDialog } from './components/atoms';
import { CartPage, DevSettings, FavoritesPage, HomePage, SettingsPage, FileViewer } from './components/pages';
import { Layout } from './components/templates';
import { useAppCore } from './useAppCore';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useTracking } from './TrackingManager'
import { db } from './database/database';

async function checkAuth() {
  const token = window.localStorage.getItem('token');
  if (token) {
    console.log('got my token from storage:' + token);
  } else {
    const token = await window.electron.ipcRenderer.login({});
    console.log('got my token from function: ' + token);
  }
}

export default function App() {
  const {
    isLoading,
    currentRouteRef,
    onRouteChanged,
    isOutdated,
    onMetadataUpdate,
    onOutdatedDismiss,
  } = useAppCore();

  const { enableLinkTracking } = useMatomo();
  const { trackStart } = useTracking()
  enableLinkTracking();

  useEffect(() => {
    // do stuff here...
    const trackStartupCountry = async () => {
      const user = await db.getUser();
      if (user && user.country) {
        trackStart(user.country);
      }
    };
    trackStartupCountry()
  }, []); 

  
  
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => {
                onRouteChanged();
                return <Redirect {...props} to="/home" />;
              }}
            />
            <Route
              path="/home"
              render={(props) => (
                <HomePage
                  {...props}
                  isMetadataLoading={isLoading}
                  initialRoute={currentRouteRef.current}
                  onRouteChanged={onRouteChanged}
                />
              )}
            />
            <Route path="/favorites" component={FavoritesPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/devsettings" component={DevSettings} />
            <Route path="/fileViewer" component={FileViewer} />
          </Switch>
        </Layout>
      </Router>
      <LoadingDialog
        open={isLoading}
        message="Logging in and getting metadata"
      />
      <UpdateMetadataDialog
        isOpen={isOutdated}
        onUpdate={onMetadataUpdate}
        onClose={onOutdatedDismiss}
      />
    </>
  );
}
