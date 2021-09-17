import { app } from 'electron';
import fs from 'fs'
import path from 'path';

const APP_FOLDER = "oneappdesktop"
const ROOT_DIR = path.join(app.getPath("appData"), APP_FOLDER)
const MODULES_FOLDER = "modules"
const CART_FOLDER = "cart"

class FileManager {
  rootFolder = ROOT_DIR
  modulesFolder = path.join(ROOT_DIR, MODULES_FOLDER)
  cartFolder = path.join(ROOT_DIR, CART_FOLDER)

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

  // removeFolderIfExists = (folderName:string):boolean => {
  //   if(this.doesFolderExist(folderName)) {
  //     fs.dele
  //   }
  // }

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

  findEntryPathForModule(pathToModule: string): string | null {
    let rootContents = fs.readdirSync( pathToModule );
    let files = rootContents.filter(this.filterForIndexHtml)

    if(files.length > 0) {
      //found index html
      return path.join(pathToModule,files[0])
    } else {
      //search second level again
      console.log("found another dir: "+ rootContents[0]);
      let secondLevelRootPath = path.join(pathToModule, rootContents[0])
      let secondLevelRootContents = fs.readdirSync( secondLevelRootPath );
      let secondLevelFiles = secondLevelRootContents.filter(this.filterForIndexHtml)
      if(secondLevelFiles.length > 0) {
        return path.join(secondLevelRootPath,secondLevelFiles[0])
      }
    }
    return null
  }

  getDirectoryContents(path: string): string[] {
    return fs.readdirSync( path );
  }

  removeCartFolder() {
    fs.rmdirSync(this.cartFolder, { recursive: true });
  }

  filterForIndexHtml = (elm:string) => elm.match("index.html")
}

export const fileManager = new FileManager()