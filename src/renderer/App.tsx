import './utils/global';
import './App.global.css';

import React, { useRef } from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { IDriveItem } from './database/database';
import { CartPage, DevSettings, FavoritesPage, HomePage, SettingsPage } from './components/pages';
import { Layout } from './components/templates';

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
  const defaultRoute = [
    {
      uniqueId: 'home',
      title: 'Home',
    },
  ];
  const currentRouteRef = useRef<IDriveItem[]>(defaultRoute);
  const onRouteChanged = (currentRoute: IDriveItem[]) => {
    currentRouteRef.current = currentRoute;
  };
  return (
    <Router>
      <Layout>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => {
              currentRouteRef.current = defaultRoute;
              return <Redirect {...props} to="/home" />;
            }}
          />
          <Route
            path="/home"
            render={(props) => (
              <HomePage
                {...props}
                initialRoute={currentRouteRef.current}
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
  );
}
