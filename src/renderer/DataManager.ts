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
    //delete the old temporary folder
    window.electron.ipcRenderer.deleteCartFolder()
    const driveItemIds = cartStore.items.map(driveItem => driveItem.listItemId).filter(notEmpty)
    console.log("cart items:" +driveItemIds)
    //download the files to send
    const downloadedFiles = await downloadFiles(driveItemIds, token)
    console.log(downloadedFiles)
    window.electron.ipcRenderer.openCartFolder()
  }
}

const sendCartMail = async(to: string[], subject?: string, text?: string) => {
  if (to.length <= 0) {
    return
  }
  const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken
  if (token) {
    //delete the old temporary folder
    window.electron.ipcRenderer.deleteCartFolder()
    const driveItemIds = cartStore.items.map(driveItem => driveItem.listItemId).filter(notEmpty)
    console.log("cart items:" +driveItemIds)
    //download the files to send
    const downloadedFiles = await downloadFiles(driveItemIds, token)
    console.log(downloadedFiles)
    //convert downloaded files to a format that can be sent as an attachment
    const attachments = await window.electron.ipcRenderer.filesToAttachments(downloadedFiles)
    // console.log('Email sent successfully',attachments)
    //window.electron.ipcRenderer.openCartFolder()
    let res = await window.electron.ipcRenderer.sendMail(to, subject, text, attachments)

    console.log('Email sent successfully to', to, attachments, res )
    return res

  }

};

window.electron.ipcRenderer.on("login-close-test", () => {
  loginCallback?.()
  //hacky
  //set to undefined to surpress double callback
  loginCallback = undefined
})

var loginCallback: (() => void) | undefined


const getMetaData = async(progressState?:(state: string) => void) => {

const authResult = await window.electron.ipcRenderer.refreshTokenSilently()
  const token = authResult.accessToken
    if (token) {
      //FETCH DETLA
      progressState?.("Delta")
      try {
        let deltaData = await fetchDelta(token);
        console.log(deltaData);
        await db.save(deltaData);
      } catch (error) {
        console.error(error);
        throw(error)
      }

      //FETCH METADATA
      progressState?.("Metadata")
      try {
        let metaData = await fetchAdditionalMetadata(token);
        await db.saveMetaData(metaData)
      } catch (error) {
        console.error(error);
        throw(error)
      }


        progressState?.("Whitelists")
        //FETCH WHITELISTS
        try {
          const whitelistDriveItems = await db.getAllWhitelists();
          let whitelists = await fetchWhitelists(whitelistDriveItems, token);
          await db.saveWhitelists(whitelists)
        } catch (error) {
          console.error(error);
          throw(error)
        }

         //CREATE USER
        //SET COUNTRY/VERSION
        await db.createUserIfEmpty()
        await db.setupInitialFavoriteGroup()

        localStorgeHelper.setLastMetdataUpdate()

    }



}


const login = async(onLoginClosed?:() => void):Promise<boolean> => {
  loginCallback = onLoginClosed

  let token = await window.electron.ipcRenderer.loginSP('');
  return (token !== null && token !== undefined)
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
  //console.log(token+" - "+driveItemId)
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
            window.electron.ipcRenderer.openHTML(newUnzippedItem.indexHtmlPath, true, false)
          }
        } else {
          console.log("found an up to date local module at" + unzippedItem.indexHtmlPath);
          window.electron.ipcRenderer.openHTML(unzippedItem.indexHtmlPath, true, false)
        }

      } else {
      console.log("found no module, therefore download new one");

       let newUnzippedItem = await downloadModule(localDriveItem.uniqueId, token)
          if(newUnzippedItem) {
            //open zip
            window.electron.ipcRenderer.openHTML(newUnzippedItem.indexHtmlPath, true, false)
          }
      }
    }
  }


}

const openDriveItem = async(uniqueId:string, progressState?:(state: string) => void) => {

  const driveItem = await db.getItemForId(uniqueId)

  const shouldOpenLocal = (!(driveItem.fileExtension  === null || driveItem.fileExtension === undefined) && driveItem.fileExtension === "zip")
  console.log("should open local"+shouldOpenLocal);

  if(driveItem.fileExtension && isAllowedFileExtension(driveItem.fileExtension)) {
   if(shouldOpenLocal) {
    await openModule(driveItem.uniqueId, progressState)
  } else {
    if(driveItem.webUrl) {
      console.log("open url: "+driveItem.webUrl);
      const openInNewWindow = shouldOpenFileInNewWindow(driveItem.fileExtension)
      console.log("open in new window: " + openInNewWindow)
      window.electron.ipcRenderer.openHTML(driveItem.webUrl, shouldOpenLocal, openInNewWindow)
    }
  }
  } else {
    console.error("wrong extension")
    throw("Can't open file extension")
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
        const thumbnail = await fetchItemThumbnail(uniqueId, token);
console.log(thumbnail);
return thumbnail;
    }
  } catch(error) {
    console.error(error);
    toast.error("Couldn't get thumbnail");
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

const isAllowedFileExtension = (extension: string):boolean => {
  const allowedExtensions = [
    "pdf",
    "docx",
    "pptx",
    "xlsx",
    "mp4",
    "zip",
    "txt",
    "rtf",
    "doc"
  ]

  const index = allowedExtensions.findIndex(ext => ext.toLowerCase() == extension.toLowerCase())
  return index != -1
}

const shouldOpenFileInNewWindow = (extension: string): boolean => {
  const extensionsThatNeedNewWindow = [
    "mp4"
  ]
  const index = extensionsThatNeedNewWindow.findIndex(ext => ext.toLowerCase() == extension.toLowerCase())
  return index != -1
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
  getAppState: getAppState,
  sendCartMail: sendCartMail
}
