import './App.global.css';
import './utils/global';

import React from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { LoadingDialog, UpdateMetadataDialog } from './components/atoms';
import { CartPage, DevSettings, FavoritesPage, HomePage, SettingsPage, FileViewer } from './components/pages';
import { Layout } from './components/templates';
import { useAppCore } from './useAppCore';

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
