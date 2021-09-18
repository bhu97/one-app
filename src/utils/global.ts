import { AuthenticationResult } from "@azure/msal-common";
import { AxiosRequestConfig } from "axios";
import { IDriveItem } from "database/database";

//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
        refreshTokenSilently: () => Promise<AuthenticationResult>;
        //getWhitelists: (urls: string[]) => Promise<string[]>;
        downloadFile: (params: {url: string, itemId: string, directory?: string}) => Promise<any>;
        fetchDriveItem: (params: {driveItemId: string, accessToken:string}) => Promise<IDriveItem>;
        unzipFile: (params: {filePath: string}) => Promise<any>;
        performRequest: (params: {url: string, options?: AxiosRequestConfig}) => Promise<any | undefined>;
        findIndexHTML: (params: {path: string}) => Promise<any | undefined>;
        openHTML:(path: string, local?:boolean) => void; 
        openCartFolder: (path?:string) => void;
      }
    }
  }
}
export {};