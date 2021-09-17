const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    login: async (arg) => {
      return await ipcRenderer.invoke('LOGIN', arg);
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
    openHTML: (path) => {
      ipcRenderer.invoke('OPEN_HTML', path);
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
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
