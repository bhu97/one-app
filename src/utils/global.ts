import { AuthenticationResult } from "@azure/msal-common";
import { DownloadItem } from "electron";

//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
        refreshTokenSilently: () => Promise<AuthenticationResult>;
        getWhitelists: (urls: string[]) => Promise<string[]>;
        downloadFile: (url: string) => Promise<any>;
      }
    }
  }
}
export {};