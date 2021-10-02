const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    login: async (arg) => {
      return await ipcRenderer.invoke('LOGIN', arg);
    },
    loginSP: async (arg) => {
      return await ipcRenderer.invoke('LOGIN_SP', arg);
    },
    refreshTokenSilently: async () => {
      return await ipcRenderer.invoke('REFRESH_TOKEN');
    },
    getWhitelists: async (arg) => {
      return await ipcRenderer.invoke('GET_WHITELISTS', arg);
    },
    downloadFile: async (arg) => {
      return await ipcRenderer.invoke('download-file', arg);
    },
    fetchDriveItem: async (arg) => {
      return await ipcRenderer.invoke('FETCH_DRIVE_ITEM', arg);
    },
    unzipFile: async (arg) => {
      return await ipcRenderer.invoke('UNZIP_FILE', arg);
    },
    performRequest: async (arg) => {
      return await ipcRenderer.invoke('PERFORM_REQUEST', arg);
    },
    findIndexHTML: async (arg) => {
      return await ipcRenderer.invoke('FIND_INDEX_HTML', arg);
    },
    openHTML: (path, local) => {
      ipcRenderer.invoke('OPEN_HTML', path, local);
    },
    openCartFolder: (path) => {
      ipcRenderer.invoke('OPEN_CART_FOLDER', path);
    },
    deleteFile: (path) => {
      ipcRenderer.invoke('DELETE_FILE', path);
    },
    deleteFolder: (path) => {
      ipcRenderer.invoke('DELETE_FOLDER', path);
    },
    deleteCartFolder: () => {
      ipcRenderer.invoke('DELETE_CART_FOLDER');
    },
    isSubDirectory: async(parent, dir) => {
      return await ipcRenderer.invoke('IS_SUB_DIRECTORY', parent, dir);
    },
    getLoginState: async() => {
      return await ipcRenderer.invoke('GET_LOGIN_STATE');
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'login-close-test'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
