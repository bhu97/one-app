import { db, DriveItem, IDriveItem } from "database/database";
import { AbstractStore } from "./AbstractStore";

export class LightStore extends AbstractStore {

  items: IDriveItem[] = []
  isRoot: boolean = false
  path?: string

  async update() {
    //If we get no path as param we query root items
    //in the other case we query by path
    this.path = this.params.path ?? null
    this.path = "01GX2IG4P2JRJHKTJBYVAK666YPBEAJQB4"
    this.isRoot = this.path == null

    //what is the currently selected country?
    const currentCountry = await db.getCurrentCountry()
    if(currentCountry) {
      let allItems:IDriveItem[] = []
    
      //query drive items for country and path
      if(this.isRoot) {
        allItems = await db.rootItemsForCountry("master") ?? []
        //RULE
        //filter out all files that start with a dot e.g. .flex or any whitelist.txt
        allItems = allItems.filter(driveItem => driveItem.name !== ".light")
        allItems = allItems.filter(driveItem => driveItem.name !== "whitelist.txt")
        //console.log(allItems);
        const regionalFolder = await db.getRegionalFolderForCountry(currentCountry)
        
        if(regionalFolder) {
          allItems.push(regionalFolder)
        }
        
      } else {
        allItems = await db.allItems(this.path) ?? []
      }
      
      //RULE
      //filter out any folder that is named Linked Files
      allItems = allItems.filter(driveItem => driveItem.name !== "Linked Files")

      //RULE
      //get whitelist for country and filter out all folders that are not in whitelist
      const whitelist = await db.whitelistArrayForCountry(currentCountry)
      if (allItems) {
        const onlyWhitelisted = this.onlyWhitelistedItems(allItems, whitelist)
        allItems = onlyWhitelisted
      }
     

      allItems = allItems.sort((a, b) => a.name!.localeCompare(b.name!))
      this.items = allItems
      console.log(allItems)
    }
  }

  onlyWhitelistedItems = (driveItems:Array<IDriveItem>, whitelistUrls:string[] ): Array<IDriveItem> => {
    let filteredItems = new Set<IDriveItem>()
    
    for (let whitelistUrl of whitelistUrls) {
      for (let driveItem of driveItems) {
        let ndriveItemUrl = this.normalizeUrl(driveItem.webUrl!)
        let nwhitelistUrl = this.normalizeUrl(whitelistUrl)
  
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

  normalizeUrl(url:string) {
    return url.split("Shared%20Documents")[1]
  }
  pathContainsSubpath(p1:string, p2:string): boolean {
    return p1.indexOf(p2) !== -1
  }

  getItems() {
    return this.items
  }
}

