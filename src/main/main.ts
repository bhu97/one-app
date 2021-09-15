/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import AuthProvider from './../authentication/AuthProvider';
import {ipcEvent} from './../utils/constants'
import { AuthenticationResult } from '@azure/msal-common';
import { fetchWhitelists } from './../authentication/fetch';
import axios from 'axios';
import { fileManager } from './filemanager/FileManager';
import { download } from 'electron-dl';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors'); 

let authProvider = new AuthProvider()

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  fileManager.setupRootFolder()

};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.handle(ipcEvent.login, async() => {
  console.log("login event");

  const loginWindow = createModalWindow(mainWindow!);
  const account = await authProvider.login(loginWindow);
  const token = await authProvider.getTokenSilent(account);

  console.log(mainWindow);
  //TODO: make a storage provider
  if (token) {
    await saveTokenToStorage(token.accessToken);
    await saveAuthToStorage(token)
  }
  loginWindow.close();  

  return token;
})

ipcMain.handle(ipcEvent.refreshToken, async() => {
  let account = await getAuthFromStorage();
  if(account) {
    let token = await authProvider.getTokenSilent(account.account);
    return token;
  }
  return null;
})

ipcMain.handle('download-file', async(event, url) => {
  if(mainWindow) {
    let response = await download(mainWindow, url, {directory: fileManager.rootFolder});
    return {
      fileName: response.getFilename(),
      savePath: fileManager.rootFolder
    }
  }
 // return await download(mainWindow!, url, {directory: fileManager.rootFolder})
})

const saveTokenToStorage = async (token: string) => {
  return await mainWindow?.webContents
  .executeJavaScript(`localStorage.setItem("token", "${token}");`, true)
}

const saveAuthToStorage = async (authorization: AuthenticationResult) => {
  let auth = JSON.stringify(authorization)
  return await mainWindow?.webContents
  .executeJavaScript(`localStorage.setItem("authorization", JSON.stringify(${auth}))`, true)
}

const getAuthFromStorage = async (): Promise<AuthenticationResult | null> => {
  const result = await mainWindow?.webContents
  .executeJavaScript(`localStorage.getItem("authorization");`, true)
    if (result) {
      //console.log(JSON.parse(result) as AuthenticationResult);
      return JSON.parse(result) as AuthenticationResult
    }
    return null
}

ipcMain.handle(ipcEvent.whitelists, async(event, urls:string[]) => {
console.log("get whitelists main");

  const accessToken = await getAuthFromStorage()
  
  const options = {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "text-plain"
    }
};

    const testUrl = "https://fresenius.sharepoint.com/teams/FMETS0269990/_layouts/15/download.aspx?UniqueId=f1f488fe-6ca0-4d03-804f-022a722df21f&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZnJlc2VuaXVzLnNoYXJlcG9pbnQuY29tQGM5OGRmNTM0LTVlMzYtNDU5YS1hYzNmLThjMmU0NDk4NjNiZCIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE2MzEzNTM5ODciLCJleHAiOiIxNjMxMzU3NTg3IiwiZW5kcG9pbnR1cmwiOiJ0NmxSK3VSdnRrdUNFLytQaUJlTGdrSDZwWkw0Zk4rdk5MdDBhTzdHR3dnPSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTM5IiwiaXNsb29wYmFjayI6IlRydWUiLCJjaWQiOiJNemMxTURGaFpqQXRNVFF5TlMwMFlqZ3pMVGhqWlRJdE9EZzVNV00yTURrM09USTUiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiWldRMk9HRTBNVEF0TVRjM05DMDBZMkprTFRreFlqZ3RaVEl5TkRBelpEQmxNMk0yIiwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJnaXZlbl9uYW1lIjoiTWF0dGhpYXMiLCJmYW1pbHlfbmFtZSI6IkJyb2RhbGthIiwic2lnbmluX3N0YXRlIjoiW1wia21zaVwiXSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwidGlkIjoiYzk4ZGY1MzQtNWUzNi00NTlhLWFjM2YtOGMyZTQ0OTg2M2JkIiwidXBuIjoibWF0dGhpYXMuYnJvZGFsa2FAZnJlc2VuaXVzLW5ldGNhcmUuY29tIiwicHVpZCI6IjEwMDM3RkZFOUZGRDgzNTQiLCJjYWNoZWtleSI6IjBoLmZ8bWVtYmVyc2hpcHwxMDAzN2ZmZTlmZmQ4MzU0QGxpdmUuY29tIiwic2NwIjoiYWxsZmlsZXMud3JpdGUgZ3JvdXAud3JpdGUgYWxsc2l0ZXMud3JpdGUgYWxscHJvZmlsZXMucmVhZCBhbGxwcm9maWxlcy53cml0ZSIsInR0IjoiMiIsInVzZVBlcnNpc3RlbnRDb29raWUiOm51bGx9.ZFhGenFZdnJIOXJFbGp1djNwMlJNVkV2YjF2cUdVQ3FabC9jS29tUzMyND0&ApiVersion=2.0"
    const dlResponse = await axios.get(testUrl, options)
    console.log(dlResponse);

    if (dlResponse.status == 302) {
        const response = await axios.get(dlResponse.request!.responseURL, options)
        console.log(response);
    } 
})

export function createModalWindow(mainWindow: BrowserWindow) {
  console.log("create modal");

  const modalWindow = new BrowserWindow({
    parent: mainWindow,
    width: 1024,
    height: 768,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: false
    },
  });

  modalWindow.setMenuBarVisibility(false);

  modalWindow.on('close', event => {
    event.preventDefault();

    modalWindow.hide();
  });

  return modalWindow;
}