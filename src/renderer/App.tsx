import '../utils/global';
import './App.global.css';

import React from 'react';
import { MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { CartPage, FavoritesPage, HomePage, SettingsPage, DevSettings } from './components/pages';
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
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={HomePage} />
          <Route path="/favorites" component={FavoritesPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/devsettings" component={DevSettings} />
        </Switch>
      </Layout>
    </Router>
  );
}
