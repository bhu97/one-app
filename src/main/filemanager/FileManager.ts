import { app } from 'electron';
import fs from 'fs'
import { promises as fsPromises } from 'fs';
import path from 'path';

const APP_FOLDER = "oneappdesktop"
const ROOT_DIR = path.join(app.getPath("appData"), APP_FOLDER)
const MODULES_FOLDER = "modules"
const CART_FOLDER = "cart"
const CACHE_FOLDER = "cache"

class FileManager {
  rootFolder = ROOT_DIR
  modulesFolder = path.join(ROOT_DIR, MODULES_FOLDER)
  cartFolder = path.join(ROOT_DIR, CART_FOLDER)
  cacheFolder = path.join(ROOT_DIR, CACHE_FOLDER)

  async setupRootFolder() {
    try {
      console.log("Checking for mandatory folders...");
      if (!this.doesRootFolderExist()) {
        console.log(`Could not find root folder`);
        console.log(`Creating ${this.rootFolder} folder...`);
        await fsPromises.mkdir(this.rootFolder)
      } else {
        console.log(`Found root folder`);
      }
      if(!this.doesCartFolderExist()) {
        console.log(`Could not find cart folder`);
        console.log(`Creating ${this.cartFolder} folder...`);
        await fsPromises.mkdir(this.cartFolder)
      } else {
        console.log(`Found cart folder`);
      }
    } catch (error) {
      console.log(error);
    }
     
  }

  doesRootFolderExist = ():boolean => {
    return this.doesFolderExist(ROOT_DIR)
  }

  doesCartFolderExist = ():boolean => {
    return this.doesFolderExist(this.cartFolder)
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

  removeCartFolder(): Promise<void> {
    return fsPromises.rmdir(this.cartFolder, { recursive: true });
  }

  removeFile(path: string): Promise<void> {
    return fsPromises.unlink(path) 
  }

  removeFolder(path: string): Promise<void> {
    if(path.includes(APP_FOLDER)) {
      return fsPromises.rmdir(path, { recursive: true });
    }
    return new Promise((resolve, _) => {resolve()})
  }

  filterForIndexHtml = (elm:string) => elm.match("index.html")

  isSubDirectory = (parent:string, dir:string) => {
    if(parent == dir) {
      return true
    }
      const relative = path.relative(parent, dir);
      const isSubdir = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    
    return isSubdir
  }
}

export const fileManager = new FileManager()