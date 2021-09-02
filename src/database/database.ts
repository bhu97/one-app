import Dexie from 'dexie';
import config from './../utils/application.config.release'
export class AppDatabase extends Dexie {

    driveItems: Dexie.Table<IDriveItem, number>;

    constructor() {

        super("OneDatabase");

        var db = this;

        db.version(1).stores({
            driveItems: driveItemsSchema,
            users: usersSchema
        });

        this.driveItems = this.table("driveItems");
    }

    async save(items: Array<IDriveItem>): Promise<number> {
        await this.removeAllDriveItems()
        return await db.driveItems.bulkPut(items)
    }

    async saveMetaData(items: Array<IListItem>) {
        for(let item of items) {
            await db.driveItems.update(item, item);
            console.log("writing entry: "+item.title);
        }
    }

    async removeAllDriveItems(): Promise<void> {
        return await db.driveItems.clear()
    }

    async isEmpty(): Promise<boolean> {
       return (await db.driveItems.toArray()).length <= 0
    }

    async allItems(uniqueId: string): Promise<Array<IDriveItem> | null> {
         const items = await db.driveItems.where(kParentReferenceId).equals(uniqueId).toArray()
         return items
    }


    async rootItems() : Promise<Array<IDriveItem> | null> {
        const items = await db.driveItems.where(kRoot).toArray()
        return items
    }

    async rootItemsForCountry(country: string) : Promise<Array<IDriveItem> | null> {
        const items = await db.driveItems.where(kCountryRoot(country)).toArray()
        if (items[0]) {
            let rootItem = items[0] as DriveItem
            return await this.allItems(rootItem.uniqueId)
        }
        return []
    }
}

//keys for where clauses
const kParentReferenceId = "parentReferenceId"
const kName = "name"
const kRoot = {
    parentReferenceId: "01GX2IG4N6Y2GOVW7725BZO354PWSELRRZ"
}

const kCountryRoot = (country: string) => {
    return {
        webUrl: config.ROOT_WEB_URL + country
    }
}



// Schemas for the table creation
const driveItemsSchema = "uniqueId, name, title, webUrl, serverRelativeUrl, timeLastModified, timeCreated, listItemId, listId, siteId, isDoclib, linkedFiles, linkedFolders, type, fileSize, fileExtension, timeDownloaded, downloadLocation, parentReferenceId"
const usersSchema = "++id, version, country"


// Interfaces for our DB Models
export interface IDriveItem {
    //id?: number;
    uniqueId: string;
    name?: string;
    webUrl?: string;
    serverRelativeUrl?: string;
    timeLastModified?: string;
    timeCreated?: string;
    listItemId?: string;
    listId?: string;
    siteId?: string;
    isDoclib?: boolean;
    title?: string;
    linkedFiles?: string;
    linkedFolders?: string;
    type?: DriveItemType;
    parentReferenceId?: string;
    //file specific
    fileSize?: number;
    fileExtension?: string;
    timeDownloaded?: string;
    downloadLocation?: string;
}

enum DriveItemType {
    FOLDER,
    FILE,
    DOCUMENTSET,
    UNKNOWN
}

export interface IUser {
    id?: number,
    version: string,
    country: string
}



export class DriveItem implements IDriveItem {
  uniqueId: string;
  webUrl: string;
  name: string;
    serverRelativeUrl?: string;
    timeLastModified?: string;
    timeCreated?: string;
    listItemId?: string;
    listId?: string;
    siteId?: string;
    isDoclib?: boolean;
    title?: string;
    linkedFiles?: string;
    linkedFolders?: string;
    type?: DriveItemType;
    //file specific
    fileSize?: number;
    fileExtension?: string;
    timeDownloaded?: string;
    downloadLocation?: string;
    parentReferenceId?: string;

  constructor(item:any) {
    this.uniqueId = item.id as string
    this.webUrl = item.webUrl;
    this.name = item.name
    this.serverRelativeUrl = item.serverRelativeUrl
    this.timeLastModified = item.timeLastModified
    this.timeCreated = item.timeCreated
    this.listItemId = item.listItemId
    this.listId = item.listId
    this.siteId = item.siteId
    this.isDoclib = item.type === "DocumentSet"
    this.title = item.title;
    this.parentReferenceId = item.parentReference.id
    
    this.type = DriveItemType.UNKNOWN

    //file specific
    this.fileSize = item.size
    //enable this in node
    //this.fileExtension = path.extname(item.file.webUrl)
  }
}

export interface IListItem {
    uniqueId: string;
    contentType: string;
    title:string;
    documentDescription: string;
    linkedFolders: string;
    linkedFiles: string;
    listItemId: string;
    type: DriveItemType;
}

export class ListItem implements IListItem {
    uniqueId: string;
    contentType: string;
    title:string;
    documentDescription: string;
    listItemId: string;
    linkedFolders: string;
    linkedFiles: string;
    type: DriveItemType;

    constructor(item:any) {
        //console.log(JSON.stringify(item))
        this.uniqueId = item.driveItem.id
        this.contentType = item.contentType.name
        this.title = item.fields.Title ?? ""
        this.documentDescription = item.fields.DocumentSetDescription ?? ""
        this.linkedFiles = item.fields.Linked_x0020_files ?? ""
        this.linkedFolders = item.fields.Linked_x0020_folders ?? ""
        this.type = item.contentType.name === "Folder" ? DriveItemType.FOLDER : DriveItemType.FILE
        this.listItemId = item.id
    }
}

//do we really need this?
// we should rather save favorites as json so updates don't lose favorites
// export interface IFavoriteGroup {

// }

// export interface IFavoriteItem {
    
// }

export var db = new AppDatabase();
