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
        const onlyWhitelisted = await this.onlyWhitelistedItems(allItems, whitelist)
        allItems = onlyWhitelisted
      }
     

      allItems = allItems.sort(this.sortByName)
      this.items = allItems

      console.log(allItems)
    }
  }

  onlyWhitelistedItems = async(driveItems:Array<IDriveItem>, whitelistUrls:string[] ): Promise<Array<IDriveItem>> => {
    let filteredItems = new Set<IDriveItem>()
    
    for (let whitelistUrl of whitelistUrls) {
      for (let driveItem of driveItems) {

        if(filteredItems.has(driveItem)) {
          continue
        }

        let ndriveItemUrl = normalizeUrl(driveItem.webUrl!)
        let nwhitelistUrl = normalizeUrl(whitelistUrl)
  
  
        if (await this.pathContainsSubpath(nwhitelistUrl, ndriveItemUrl)) {
          filteredItems.add(driveItem)
        } else {
          if(await this.pathContainsSubpath(ndriveItemUrl, nwhitelistUrl)) {
            filteredItems.add(driveItem)
          }
        }
      }
    }
    return Array.from(filteredItems)
  }

  async pathContainsSubpath(p1:string, p2:string): Promise<boolean> {
    let contains = await window.electron.ipcRenderer.isSubDirectory(p1, p2)
    //console.log(`${p1} contains ${p2} => ${contains}`)
    return contains
  }

  

  getItems() {
    return this.items
  }
}

