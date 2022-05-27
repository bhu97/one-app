import { AuthenticationResult } from "@azure/msal-common";
import { AxiosRequestConfig } from "axios";
import { IDriveItem } from "renderer/database/database";
import { ILoginState } from "./constants";

//expose the ipc renderer
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        login: (arg:any) => Promise<string>;
        loginSP: (arg:any) => Promise<string>;
        refreshTokenSilently: () => Promise<AuthenticationResult>;
        //getWhitelists: (urls: string[]) => Promise<string[]>;
        downloadFile: (params: {url: string, itemId: string, directory?: string, accessToken?:string}) => Promise<any>;
        fetchDriveItem: (params: {driveItemId: string, accessToken:string}) => Promise<IDriveItem>;
        unzipFile: (params: {filePath: string}) => Promise<any>;
        performRequest: (params: {url: string, options?: AxiosRequestConfig}) => Promise<any | undefined>;
        findIndexHTML: (params: {path: string}) => Promise<any | undefined>;
        openHTML:(path: string, local?:boolean, newWindow?:boolean) => void; 
        openCartFolder: (path?:string) => void;
        deleteFile: (path: string) => Promise<void>;
        deleteFolder: (path: string) => Promise<void>;
        deleteCartFolder: () => Promise<void>;
        isSubDirectory: (parent:string, dir:string) => Promise<boolean>;
        getLoginState: () => Promise<ILoginState>;
        sendMail: (to: string[], subject?:string, text?: string, attachments?: Array<any>) => Promise<void>
        filesToAttachments: (files: Array<{fileName: string, savePath: string}>) => Promise<Array<any>>
        on: (channel:string, func: (...args: any[]) => void) => void
      }
    }
  }
}
export {};