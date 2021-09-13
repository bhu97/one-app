import React from 'react';
import { MemoryRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.global.css';
import '../utils/global'
import { useEffect } from 'react';
import { CircularProgress, CssBaseline, Dialog, DialogTitle, Divider, ThemeProvider, Typography } from '@material-ui/core';
import  HomePage  from './pages/Home/home'
import  theme from './theme';
import { LoadingDialog } from './components/ui/Loading';
import DevSettings from './pages/DevSettings';
import FavoritesPage from './pages/Favorites';
import SettingsPage from './pages/Settings';
import CartPage from './pages/Cart';


async function checkAuth() {
  const token = window.localStorage.getItem("token")
  if(token) {
    console.log("got my token from storage:" + token)
  } else {
    const token = await window.electron.ipcRenderer.login({})
    console.log("got my token from function: " + token)
  }
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline/>
        <Router> 
        <Switch>
          <Route exact path="/">
            <Redirect to="/home"/>
          </Route> 
          <Route path="/home" component={HomePage} />
          <Route path="/favorites" component={FavoritesPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/devsettings" component={DevSettings} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}


