import { DriveItem, IDriveItem } from "renderer/database/database";

export interface IStoreParams {
  query?: string
}

export interface IStore {
  items: IDriveItem[]
  update: () => void
  getItems: () => Array<IDriveItem>
}


export abstract class AbstractStore implements IStore{

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

  linkedUrlListToArray(urlListText: string): string[] {
    return urlListText.split(",").map(url => url.trim())
  }
}