import { db, IDriveItem } from "renderer/database/database";
import { AbstractStore } from "./AbstractStore";

export class FlexStore extends AbstractStore {

  async update() {
    this.isRoot = (this.params.query == null)

    const currentCountry = await db.getCurrentCountry()
    if(currentCountry) {
      let allItems:IDriveItem[] = []
    
      //query drive items for country and path
      console.log(currentCountry);
      if(this.isRoot) {
        allItems = await db.rootItemsForCountry(currentCountry) ?? []   
      } else {
        if(this.params.query) {
          allItems = await db.allItems(this.params.query) ?? []
        }
      }

      //RULE
      //filter out all files that start with a dot e.g. .flex or any whitelist.txt
      allItems = this.filterVersionFiles(allItems)
      allItems = this.filterWhitelistFiles(allItems)
      //RULE
      //filter out any folder that is named Linked Files
      allItems = this.filterLinkedFilesFolder(allItems)

      //RULE
      //display folder only if it has a matching master folder
      //e.g. /DEU/ExampleFolder has matching /master/ExampleFolder => this will get displayed
      //e.g. /DEU/ExampleFolder123 has no matching folder in master => this will be hidden
      let visibleItems:IDriveItem[] = []

      for(let driveItem of allItems) {
        if(driveItem.webUrl) {
          const hasMatchingMasterFolder = await db.hasMatchingMasterFolder(currentCountry, driveItem.webUrl)
          if(hasMatchingMasterFolder) {
            visibleItems.push(driveItem)
          }
        }
      }

      allItems = visibleItems
      allItems.sort(this.sortByName)

      this.items = allItems
  }
}


}