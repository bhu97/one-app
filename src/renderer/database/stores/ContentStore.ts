import { db, IDriveItem } from "renderer/database/database";
import { AbstractStore } from "./AbstractStore";

export class ContentStore extends AbstractStore {

  async update() {
    this.isRoot = (this.params.query == null)

    const currentCountry = await db.getCurrentCountry()
    if(currentCountry) {
      let allItems:IDriveItem[] = []
    
      //query drive items for country and path
      if(this.params.query) {
        allItems = await db.allItems(this.params.query) ?? []
      }

      allItems.sort(this.sortByName)
      console.log("items: "+ allItems.map(item => item.uniqueId))

      this.items = allItems
  }
}


}