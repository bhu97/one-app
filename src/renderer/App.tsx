import React from 'react';
import { MemoryRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.global.css';
import '../utils/global'
import { useEffect } from 'react';
import { CircularProgress, CssBaseline, Dialog, DialogTitle, Divider, ThemeProvider, Typography } from '@material-ui/core';
import { HomePage } from './pages/home';
import  theme from './theme';



const Hello = () => {
  // useEffect(()=>{
  //   checkAuth()
  // })

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
        <a
          href="#"
        >
          <button type="button" onClick={() => {checkAuth()}}>
            <span role="img" aria-label="books">
              🙏
            </span>
            Open
          </button>
        </a>
      </div>
      <SimpleDialog open={true}></SimpleDialog>
    </div>
  );
};

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
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

function SimpleDialog(props:any) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value:any) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Loading metadata</DialogTitle>
      <CircularProgress />
      <Typography>Please wait...</Typography>
    </Dialog>
  );
}
