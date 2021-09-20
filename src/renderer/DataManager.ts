import { localStorgeHelper } from "./../database/storage";
import { fetchAdditionalMetadata, fetchDelta, fetchDriveItem, fetchWhitelists } from "./../authentication/fetch";
import { db, DriveItem, DriveItemType, IDriveItem, IUnzippedModuleItem } from "./../database/database";
import { isNullOrUndefined } from "util";
import dayjs from "dayjs";
import { cartStore } from "database/stores/CartStore";


/**
 * Downloads driveItems and updates their download location
 * @param driveItemIds driveItem uniqueIds to download
 * @returns download paths or error
 */
const downloadFiles = async(driveItemIds: string[]) => {

}


const downloadCartFiles = async() => {
  const driveItemIds = cartStore.items.map(driveItem => driveItem.uniqueId)
  await downloadFiles(driveItemIds)
  window.electron.ipcRenderer.openCartFolder()
}

const getMetaData = async(progressState?:(state: string) => void):Promise<boolean | AppError> => {

  return new Promise(async (resolve, reject) => {


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
        reject(AppError.DELTA_ERROR)
        throw(error)
      }

      //FETCH METADATA
      progressState?.("metadata")
      try {
        let metaData = await fetchAdditionalMetadata(token);
        await db.saveMetaData(metaData)
      } catch (error) {
        reject(AppError.METADATA_ERROR)
        throw(error)
      }
      
        //CREATE USER
        //SET COUNTRY/VERSION
        await db.createUserIfEmpty()

        progressState?.("whitelists")
        //FETCH WHITELISTS
        try {
          const whitelistDriveItems = await db.getAllWhitelists();
        let whitelists = await fetchWhitelists(whitelistDriveItems, token);
        await db.saveWhitelists(whitelists)
        } catch (error) {
          console.error(error);
          reject(AppError.WHITELIST_ERROR)
        }

        localStorgeHelper.setLastMetdataUpdate()
        resolve(true)
    }


  })

  
}


const login = async() => {}
const downloadModule = async(uniqueId: string, token?:string) => {

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

const openModule = async(uniqueId:string) => {
  const localDriveItem = await db.getItemForId(uniqueId)
  const driveItemId = localDriveItem.listItemId

  const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken

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
          let newUnzippedItem = await downloadModule(driveItem.uniqueId, token)
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

const openDriveItem = async(uniqueId:string) => {
  
  const driveItem = await db.getItemForId(uniqueId)
  
  const shouldOpenLocal = (!(driveItem.fileExtension  === null || driveItem.fileExtension === undefined) && driveItem.fileExtension === "application/zip") 
  console.log("should open local"+shouldOpenLocal);
  
  if(shouldOpenLocal) {
    openModule(driveItem.uniqueId)
  } else {  
    if(driveItem.webUrl) {
      window.electron.ipcRenderer.openHTML(driveItem.webUrl, shouldOpenLocal)
    }
  }
    
}
//const openOrDownloadModule = async() => {}
const shouldShowUpdateAlert = async() => {}
const getThumbnails = async() => {}

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
  openModule: openModule
}