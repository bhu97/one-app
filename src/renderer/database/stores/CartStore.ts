import { db, IDriveItem } from "renderer/database/database";
import { fileSizeMax } from "renderer/utils/constants";
import { notEmpty } from "renderer/utils/helper";
import { AbstractStore } from "./AbstractStore";


class CartStore extends AbstractStore {
  uniqueIds = new Set<string>()
  fileSizeLimit = fileSizeMax
  fileSizes = 0

  isFileSizeUnderMaximum = (): boolean => {
    console.log(`sizes: ${this.fileSizes}, limit ${this.fileSizeLimit}`)
    return this.fileSizes <= this.fileSizeLimit
  }

  async update() {
    console.log("Here")
    if(this.uniqueIds.size <= 0) {
      this.items = []
    }

    let allItems = await db.getItemsForIds(Array.from(this.uniqueIds))
    console.log('allItems', allItems)

    this.fileSizes = allItems.map(this.driveItemToFileSize).filter(notEmpty).reduce(this.addFileSizes, 0)
    console.log('fileSizes', this.fileSizes)
    this.items = allItems
    return
  }

  addDriveItem(uniqueId: string) {
    this.uniqueIds.add(uniqueId)
  }

  removeDriveItem(uniqueId: string) {
    this.uniqueIds.delete(uniqueId)
  }

  removeAll() {
    this.uniqueIds.clear()
    this.items = []
    this.fileSizes = 0
    //console.log(`${Array.from(this.uniqueIds).length} - ${this.items.length} - ${this.fileSizes}`);
  }

  driveItemToFileSize = (driveItem: IDriveItem) => driveItem.fileSize
  addFileSizes = (fileSize1: number, fileSize2: number) => fileSize1 + fileSize2
}

export const cartStore = new CartStore({})
