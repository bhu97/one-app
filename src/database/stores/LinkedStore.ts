import { db, IDriveItem } from "database/database";
import { AbstractStore } from "./AbstractStore";


// The store for linked files of a document set
//pass the unique id of the document set as query
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
          allItems = allItems.concat(driveItems)
        }

        if(driveItem.linkedFolders) {
          const folderWebUrls = this.linkedUrlListToArray(driveItem.linkedFolders)
          
          let driveItems = await db.getItemsForWebUrls(folderWebUrls)
          allItems = allItems.concat(driveItems)
        }
      }
    }    
    this.items = allItems  
  }
}