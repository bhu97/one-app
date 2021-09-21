import extract from "extract-zip"
import { fileManager } from "./../filemanager/FileManager"
class ZipManager {
  async unzipFile(filePath:string):Promise<any> {
    const targetDir = filePath+"-unzipped"
    
    return new Promise<any>(async (resolve, reject) => {
      try {
        await extract(filePath, {
          dir: targetDir
        })

        let indexPath = fileManager.findEntryPathForModule(targetDir)
        console.log("indexPath: "+indexPath)
        let response = {
          filePath: filePath,
          targetDir: targetDir,
          indexHtmlPath: indexPath
        }

        resolve(response)
      }
      catch(error) {
        reject(error)
      }
    })

  }

  async zipCartFolder():Promise<any> {
    
  }
}

export const zipManager = new ZipManager()