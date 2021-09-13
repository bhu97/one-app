import { db, IDriveItem } from "database/database";
import { AbstractStore } from "./AbstractStore";


export class LinkedStore extends AbstractStore {

  async update() {
    let allItems:IDriveItem[] = []
  
    const uniqueId = this.params.query

    if(uniqueId) {
      const driveItem = await db.getItemForId(uniqueId)
      if(driveItem.isDocSet) {
        if(driveItem.linkedFiles) {
          const fileWebUrls = this.linkedUrlListToArray(driveItem.linkedFiles)
          let driveItems = await db.getItemsForWebUrls(fileWebUrls)
          allItems.concat(driveItems)
        }

        if(driveItem.linkedFolders) {
          const folderWebUrls = this.linkedUrlListToArray(driveItem.linkedFolders)
          
          console.log(folderWebUrls);
          let driveItems = await db.getItemsForWebUrls(folderWebUrls)
          allItems.concat(driveItems)
        }
      }
    }

    this.items = allItems
  }
}