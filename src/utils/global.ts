import { AuthenticationResult } from "@azure/msal-common";

//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
        refreshTokenSilently: () => Promise<AuthenticationResult>;
        getWhitelists: (urls: string[]) => Promise<string[]>;
      }
    }
  }
}
export {};