import { app } from 'electron';
import fs from 'fs'
import path from 'path';

const APP_FOLDER = "oneappdesktop"
const ROOT_DIR = path.join(app.getPath("appData"), APP_FOLDER)

class FileManager {
  rootFolder = ROOT_DIR

  setupRootFolder():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.doesRootFolderExist()) {
        console.log('Directory exists already');
        resolve()
        return
      }
      fs.mkdir(ROOT_DIR, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
        console.log('Directory created successfully!');
      });
    })
    
  }
  doesRootFolderExist = ():boolean => {
    return this.doesFolderExist(ROOT_DIR)
  }

  doesFolderExist = (folderName:string):boolean => {
    return fs.existsSync(folderName)
  }

  createFolder(folderName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(path.join(app.getPath("appData"), folderName), (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      });
    })
  }
}

export const fileManager = new FileManager()