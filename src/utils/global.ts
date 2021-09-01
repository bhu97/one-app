//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
      }
    }
  }
}
export {};