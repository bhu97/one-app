import { db, IDriveItem } from "database/database";
import { AbstractStore } from "./AbstractStore";

class FlexStore extends AbstractStore {
  items: IDriveItem[] = []
  isRoot: boolean = false
  path?: string

  async update() {
    const currentCountry = await db.getCurrentCountry()
    if(currentCountry) {
      let allItems:IDriveItem[] = []
    
      //query drive items for country and path
      if(this.isRoot) {
        allItems = await db.rootItemsForCountry(currentCountry) ?? []
        //RULE
        //filter out all files that start with a dot e.g. .flex or any whitelist.txt
        allItems = allItems.filter(driveItem => driveItem.name !== ".light")
        allItems = allItems.filter(driveItem => driveItem.name !== "whitelist.txt")       
      } else {
        if(this.path) {
          allItems = await db.allItems(this.path) ?? []
        }
      }
      this.items = allItems
  }
}


}