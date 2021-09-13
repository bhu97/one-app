import { db, IDriveItem } from "database/database";
import { fileSizeMax } from "utils/constants";
import { notEmpty } from "utils/helper";
import { AbstractStore } from "./AbstractStore";


class CartStore extends AbstractStore {
  uniqueIds = new Set<string>()
  fileSizeLimit = fileSizeMax
  fileSizes = 0

  isFileSizeUnderMaximum = ():boolean => {
    return this.fileSizes <= this.fileSizeLimit
  }

  async update() {
    if(this.uniqueIds.size <= 0) {
      this.items = []
      return
    }

    let allItems = await db.getItemsForIds(Array.from(this.uniqueIds))
    allItems.map(this.driveItemToFileSize).filter(notEmpty).reduce(this.addFileSizes, 0)
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