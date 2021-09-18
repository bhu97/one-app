import { localStorgeHelper } from "./../database/storage";
import { fetchAdditionalMetadata, fetchDelta, fetchWhitelists } from "./../authentication/fetch";
import { db } from "./../database/database";


/**
 * Downloads driveItems and updates their download location
 * @param driveItemIds driveItem uniqueIds to download
 * @returns download paths or error
 */
const downloadFiles = async(driveItemIds: string[]) => {}


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
        //throw(error)
        reject(AppError.DELTA_ERROR)
      }

      //FETCH METADATA
      progressState?.("metadata")
      try {
        let metaData = await fetchAdditionalMetadata(token);
        await db.saveMetaData(metaData)
      } catch (error) {
        //throw(error)
        reject(AppError.METADATA_ERROR)
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
const downloadModule = async() => {}
const openModule = async() => {}
const openDriveItem = async() => {}
const openOrDownloadModule = async() => {}
const shouldShowUpdateAlert = async() => {}
const getThumbnails = async() => {}

export const dataManager = {
  login: login,
  getMetaData: getMetaData,
  downloadFiles: downloadFiles
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