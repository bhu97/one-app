import { toast } from 'material-react-toastify';
import dayjs from 'dayjs';
import { cartStore } from 'renderer/database/stores/CartStore';
import { notEmpty } from 'renderer/utils/helper';

import {
  fetchAdditionalMetadata,
  fetchDelta,
  fetchDriveItem,
  fetchItemThumbnail,
  fetchThumbnails,
  fetchWhitelists,
} from './components/fetch';
import { db, IUnzippedModuleItem, Thumbnail } from './database/database';
import { localStorgeHelper } from './database/storage';
import { IAppState, MetaDataState } from './utils/constants';


/**
 * Downloads driveItems and updates their download location
 * @param driveItemIds driveItem listItemId to download
 * @returns download paths or error
 */
const downloadFiles = async(driveItemIds: string[], token: string):Promise<any[]> => {

  return new Promise(async(resolve, _) => {
    let downloadItems: any[] = []
    try {
      for (let driveItemId of driveItemIds) {
        let downloadItem = await window.electron.ipcRenderer.downloadFile({
          url: '',
          itemId: driveItemId,
          directory: 'CART',
          accessToken: token
        });
        downloadItems.push(downloadItem)
      }
    } catch (error) {
      console.error(error);
    }
    resolve(downloadItems)
  })
}


const downloadCartFiles = async() => {
  const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken
  if (token) {
    window.electron.ipcRenderer.deleteCartFolder()
    const driveItemIds = cartStore.items.map(driveItem => driveItem.listItemId).filter(notEmpty)
    console.log("cart items:" +driveItemIds)
    await downloadFiles(driveItemIds, token)
    window.electron.ipcRenderer.openCartFolder()
  }
}

const getMetaData = async(progressState?:(state: string) => void) => {

const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken
    if (token) {
      //FETCH DETLA
      progressState?.("delta")
      try {
        let deltaData = await fetchDelta(token);
        console.log(deltaData);
        await db.save(deltaData);
      } catch (error) {
        console.error(error);
        throw(error)
      }

      //FETCH METADATA
      progressState?.("metadata")
      try {
        let metaData = await fetchAdditionalMetadata(token);
        await db.saveMetaData(metaData)
      } catch (error) {
        console.error(error);
        throw(error)
      }

       
        progressState?.("whitelists")
        //FETCH WHITELISTS
        try {
          const whitelistDriveItems = await db.getAllWhitelists();
        let whitelists = await fetchWhitelists(whitelistDriveItems, token);
        await db.saveWhitelists(whitelists)
        } catch (error) {
          throw(error)
          console.error(error);
        }

         //CREATE USER
        //SET COUNTRY/VERSION
        await db.createUserIfEmpty()


        localStorgeHelper.setLastMetdataUpdate()

    }



}


const login = async(onLoginClosed?:() => void):Promise<boolean> => {

  // window.electron.ipcRenderer.on("login-close-test", () => {
  //   console.log("closed login");
  // })
  return new Promise<boolean>(async(resolve, reject) => {
    //check if a login is needed
    
    let token = await window.electron.ipcRenderer.login('');
    if(token) {
      resolve(true)
    }
    resolve(false)
  })
}

const downloadModule = async(uniqueId: string, token?:string, progressState?:(state: string) => void) => {

  return new Promise<IUnzippedModuleItem|undefined>(async(resolve, reject) => {


    //token = token ? token : (await window.electron.ipcRenderer.refreshTokenSilently()).accessToken
    if(token) {
      try {

        const driveItem = await db.getItemForId(uniqueId)
        const driveItemId = driveItem.listItemId
        if(driveItemId) {
      console.log("download module")

      //console.log(driveItem);
      if (driveItem ) {
        console.log(driveItem.graphDownloadUrl);
        console.log("download module item");

        progressState?.("download")
        let downloadItem = await window.electron.ipcRenderer.downloadFile({
          url: driveItem.graphDownloadUrl ?? "",
          itemId: driveItemId,
          directory: 'MODULES',
          accessToken: token
        });

        if (downloadItem) {
          db.updateDownloadLocationForDriveItem(
            driveItemId,
            `${downloadItem.savePath}/${downloadItem.fileName}`
          );

          console.log("unzipping module");

          progressState?.("unzip")
          let zipResponse = await window.electron.ipcRenderer.unzipFile({
            filePath: `${downloadItem.savePath}/${downloadItem.fileName}`,
          });

          if (zipResponse) {
            let unzippedModuleItem = {
              driveItemId: driveItemId,
              zipPath: `${downloadItem.savePath}/${downloadItem.fileName}`,
              targetPath: zipResponse.targetDir,
              modifiedDate: driveItem.timeLastModified ?? dayjs().toISOString(),
              uniqueId: driveItem.uniqueId,
              indexHtmlPath: zipResponse.indexHtmlPath,
            }
            await db.saveUnzippedItem(unzippedModuleItem);

            resolve(unzippedModuleItem)
          }
        }

      }
    }

    }
    catch(error) {
      console.error(error);
      reject(error)
    }

  }
  })
}

const openModule = async(uniqueId:string, progressState?:(state: string) => void) => {
  console.log(uniqueId)
  const localDriveItem = await db.getItemForId(uniqueId)
  const driveItemId = localDriveItem.listItemId

  progressState?.("authentication")
  const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken
console.log(token+" - "+driveItemId)
  if(token) {
    if(driveItemId) {
      const driveItem = await fetchDriveItem(driveItemId, token)
      //find out if module exists already
      const unzippedItem = await db.getUnzippedItem(localDriveItem.uniqueId)
      console.log("get unzipped item: "+ unzippedItem);

      if(driveItem && unzippedItem) {
        //is existing module older than online one?
        const driveItemModifiedDate = dayjs(driveItem.timeLastModified)
        const unzippedItemModifiedDate = dayjs(unzippedItem.modifiedDate)
        if(unzippedItemModifiedDate.isBefore(driveItemModifiedDate)) {
          console.log("found an outdated zip module, downloading new one");

          //remove existing zip
          await window.electron.ipcRenderer.deleteFile(unzippedItem.zipPath)
          await window.electron.ipcRenderer.deleteFolder(unzippedItem.targetPath)
          //download new zip
          let newUnzippedItem = await downloadModule(driveItem.uniqueId, token, progressState)
          if(newUnzippedItem) {
            //open zip
            window.electron.ipcRenderer.openHTML(newUnzippedItem.indexHtmlPath, true)
          }
        } else {
          console.log("found an up to date local module");
          window.electron.ipcRenderer.openHTML(unzippedItem.indexHtmlPath, true)
        }

      } else {
      console.log("found no module, therefore download new one");

       let newUnzippedItem = await downloadModule(localDriveItem.uniqueId, token)
          if(newUnzippedItem) {
            //open zip
            window.electron.ipcRenderer.openHTML(newUnzippedItem.indexHtmlPath, true)
          }
      }
    }
  }


}

const openDriveItem = async(uniqueId:string, progressState?:(state: string) => void) => {

  const driveItem = await db.getItemForId(uniqueId)

  const shouldOpenLocal = (!(driveItem.fileExtension  === null || driveItem.fileExtension === undefined) && driveItem.fileExtension === "zip")
  console.log("should open local"+shouldOpenLocal);

  if(shouldOpenLocal) {
    openModule(driveItem.uniqueId, progressState)
  } else {
    if(driveItem.webUrl) {
      console.log("open url: "+driveItem.webUrl);
      
      window.electron.ipcRenderer.openHTML(driveItem.webUrl, shouldOpenLocal)
    }
  }

}
//const openOrDownloadModule = async() => {}
const shouldShowUpdateAlert = ():boolean => {
  return localStorgeHelper.shouldShowUpdateAlert()
}

const getThumbnails = async(uniqueId: string):Promise<Thumbnail[]> => {
  try {
    const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
    const token = authResult.accessToken

    if(token) {
        return await fetchThumbnails(uniqueId, token)
    }
  } catch(error) {
    console.error(error);
    toast.error("Couldn't get thumbnails");
  }
  return []
}

const getItemThumbnail = async(uniqueId: string):Promise<Thumbnail | undefined> => {
  try {
    const authResult = await window.electron.ipcRenderer.refreshTokenSilently();
    const token = authResult.accessToken;

    if(token) {
        return await fetchItemThumbnail(uniqueId, token);
    }
  } catch(error) {
    console.error(error);
    toast.error("Couldn't get thumbnails");
  }
  return undefined;
}

const getAppState = async(): Promise<IAppState> => {
  let loginState = await window.electron.ipcRenderer.getLoginState()
  let metadataState = MetaDataState.VALID

  const isDBEmpty = await db.isEmpty()
  if(isDBEmpty) {
    metadataState = MetaDataState.NO_METADATA
  } else {
    if(localStorgeHelper.shouldShowUpdateAlert()) {
      metadataState = MetaDataState.HAS_UPDATES
    }
  }  

  console.log("login state: "+JSON.stringify(loginState));
  let appState:IAppState = {
    ...loginState,
    metadata: metadataState
  }

  return appState
  //check valid login
  //check login/token old
  //check valid metadata
  //check new updates online
  //check error
}



export enum AppError {
  NO_LOGIN,
  NO_DATA,
  INVALID_AUTH,
  FETCH_ERROR,
  DB_ERROR,
  WRITE_ERROR,
  UNKNOWN,
  DELTA_ERROR,
  METADATA_ERROR,
  WHITELIST_ERROR
}

export const dataManager = {
  login: login,
  getMetaData: getMetaData,
  downloadFiles: downloadFiles,
  openDriveItem: openDriveItem,
  openModule: openModule,
  downloadCartFiles: downloadCartFiles,
  shouldShowUpdateAlert: shouldShowUpdateAlert,
  getThumbnails: getThumbnails,
  getItemThumbnail: getItemThumbnail,
  getAppState: getAppState
}
