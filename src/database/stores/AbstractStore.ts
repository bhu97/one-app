import { DriveItem, IDriveItem } from "database/database";

interface IStoreParams {
  path?: string
}
export abstract class AbstractStore {

  items: IDriveItem[] = []
  isRoot: boolean = false

  constructor(public params: IStoreParams) {}
  update() {}
  getItems(): Array<IDriveItem> { return [] }

  filterVersionFiles(driveItems: IDriveItem[]):IDriveItem[] {
    return driveItems
    .filter(driveItem => driveItem.name !== ".light")
    .filter(driveItem => driveItem.name !== ".flex")
  }

  filterWhitelistFiles(driveItems: IDriveItem[]):IDriveItem[] {
    return driveItems.filter(driveItem => driveItem.name !== "whitelist.txt")
  }

  filterLinkedFilesFolder(driveItems: IDriveItem[]):IDriveItem[]  {
    return driveItems.filter(driveItem => driveItem.name !== "Linked Files")
  }

  sortByName = (a:IDriveItem, b:IDriveItem) => a.name!.localeCompare(b.name!)
}