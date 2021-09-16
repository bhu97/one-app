import { AuthenticationResult } from "@azure/msal-common";
import { IDriveItem } from "database/database";

//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
        refreshTokenSilently: () => Promise<AuthenticationResult>;
        getWhitelists: (urls: string[]) => Promise<string[]>;
        downloadFile: (params: {url: string, itemId: string}) => Promise<any>;
        fetchDriveItem: (params: {driveItemId: string}) => Promise<IDriveItem>;
        unzipFile: (params: {filePath: string}) => Promise<any>;
      }
    }
  }
}
export {};