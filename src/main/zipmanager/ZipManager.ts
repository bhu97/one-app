import extract from "extract-zip"
class ZipManager {
  async unzipFile(filePath:string):Promise<any> {
    const targetDir = filePath+"-unzipped"
    await extract(filePath, {
      dir: targetDir
    })

    return {
      filePath: filePath,
      targetDir: targetDir
    }
  }

  async zipCartFolder():Promise<any> {
    
  }
}

export const zipManager = new ZipManager()