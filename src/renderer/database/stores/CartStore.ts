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
    if(this.uniqueIds.size <= 0) {
      this.items = []
      return
    }

    let allItems = await db.getItemsForIds(Array.from(this.uniqueIds))
    
    this.fileSizes = allItems.map(this.driveItemToFileSize).filter(notEmpty).reduce(this.addFileSizes, 0)
    this.items = allItems
  }

  addDriveItem(uniqueId: string) {
    this.uniqueIds.add(uniqueId)
  }

  removeDriveItem(uniqueId: string) {
    this.uniqueIds.delete(uniqueId)
  }

  removeAll() {
    this.uniqueIds.clear()
  }

  driveItemToFileSize = (driveItem: IDriveItem) => driveItem.fileSize
  addFileSizes = (a: number, b: number) => a + b
}

export const cartStore = new CartStore({})