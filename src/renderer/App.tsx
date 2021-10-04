import './App.global.css';
import './utils/global';

import React from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { LoadingDialog } from './components/atoms';
import { CartPage, DevSettings, FavoritesPage, HomePage, SettingsPage } from './components/pages';
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
  const { isLoading, currentRoute, onRouteChanged } = useAppCore();
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
                  initialRoute={currentRoute}
                  onRouteChanged={onRouteChanged}
                />
              )}
            />
            <Route path="/favorites" component={FavoritesPage} />
            <Route path="/cart" component={CartPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/devsettings" component={DevSettings} />
          </Switch>
        </Layout>
      </Router>
      <LoadingDialog open={isLoading} />
    </>
  );
}
