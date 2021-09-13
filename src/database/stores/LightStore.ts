import { db, IDriveItem } from "database/database";
import { normalizeUrl } from "utils/helper";
import { AbstractStore } from "./AbstractStore";

export class LightStore extends AbstractStore {

  async update() {
    //If we get no path as param we query root items
    //in the other case we query by path
    this.isRoot = (this.params.query == null)

    //what is the currently selected country?
    const currentCountry = await db.getCurrentCountry()
    if(currentCountry) {
      let allItems:IDriveItem[] = []
    
      //query drive items for country and path
      if(this.isRoot) {
        allItems = await db.rootItemsForCountry("master") ?? []
        //RULE
        //filter out all files that start with a dot e.g. .flex or any whitelist.txt
        allItems = this.filterVersionFiles(allItems)
        allItems = this.filterWhitelistFiles(allItems)
        //console.log(allItems);
        const regionalFolder = await db.getRegionalFolderForCountry(currentCountry)
        
        if(regionalFolder) {
          allItems.push(regionalFolder)
        }
        
      } else {
        if(this.params.query) {
          allItems = await db.allItems(this.params.query) ?? []
        }
      }
      
      //RULE
      //filter out any folder that is named Linked Files
      allItems = this.filterLinkedFilesFolder(allItems)

      //RULE
      //get whitelist for country and filter out all folders that are not in whitelist
      const whitelist = await db.whitelistArrayForCountry(currentCountry)
      if (allItems) {
        const onlyWhitelisted = this.onlyWhitelistedItems(allItems, whitelist)
        allItems = onlyWhitelisted
      }
     

      allItems = allItems.sort(this.sortByName)
      this.items = allItems

      console.log(allItems)
    }
  }

  onlyWhitelistedItems = (driveItems:Array<IDriveItem>, whitelistUrls:string[] ): Array<IDriveItem> => {
    let filteredItems = new Set<IDriveItem>()
    
    for (let whitelistUrl of whitelistUrls) {
      for (let driveItem of driveItems) {
        let ndriveItemUrl = normalizeUrl(driveItem.webUrl!)
        let nwhitelistUrl = normalizeUrl(whitelistUrl)
  
        let components1 = nwhitelistUrl.split("/").length
        let components2 = ndriveItemUrl.split("/").length
  
        if (components1<=components2) {
          if (this.pathContainsSubpath(ndriveItemUrl, nwhitelistUrl)) {
            filteredItems.add(driveItem)
          }
        } else {
          console.log("deep case")
          if (this.pathContainsSubpath(nwhitelistUrl, ndriveItemUrl)) {
            filteredItems.add(driveItem)
          }
        } 
      }
    }
    return Array.from(filteredItems)
  }

  pathContainsSubpath(p1:string, p2:string): boolean {
    return p1.indexOf(p2) !== -1
  }

  getItems() {
    return this.items
  }
}

