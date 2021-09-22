import Dexie from 'dexie';
import { findCountry, normalizeUrl, notEmpty } from './../utils/helper';
import config from './../utils/application.config.release'
import { getExtension } from '../utils/object.mapping';
export class AppDatabase extends Dexie {

    driveItems: Dexie.Table<IDriveItem, number>;
    users: Dexie.Table<IUser, number>;
    favoriteGroups: Dexie.Table<IFavoriteGroup, number>;
    favorites: Dexie.Table<IFavorite, number>;
    whitelists: Dexie.Table<IWhitelist, number>;
    cartItems: Dexie.Table<ICartItem, number>;
    unzippedItems: Dexie.Table<IUnzippedModuleItem, number>;

    constructor() {

        super("OneDatabase");

        var db = this;

        db.version(1).stores({
            driveItems: driveItemsSchema,
            users: usersSchema,
            favoriteGroups: favoriteGroupSchema,
            favorites: favoriteSchema,
            whitelists: whitelistsSchema,
            cartItems: cartItemsSchema,
            unzippedItems: unzippedItemSchema
        });

        this.driveItems = this.table("driveItems");
        this.users = this.table("users");
        this.whitelists = this.table("whitelists");
        this.favoriteGroups = this.table("favoriteGroups");
        this.favorites = this.table("favorites");
        this.cartItems = this.table("cartItems");
        this.unzippedItems = this.table("unzippedItems");
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
    async getItemForId(uniqueId: string): Promise<IDriveItem> {
        return (await db.driveItems.where(kUniqueId).equals(uniqueId).toArray())[0]
    }

    //TODO: fix speed 
    async getItemsForWebUrls(weburls: string[]): Promise<IDriveItem[]> {
        let foundItems:IDriveItem[] = []
        let items = await db.driveItems.where({contentType: "Document"}).toArray()
        for (let webUrl of weburls) {
            let item = items.filter(driveItem => {
                if(driveItem.webUrl) {
                    return driveItem.webUrl.includes(webUrl) 
                } 
                return false
            })
            //console.log("found item" + JSON.stringify(item[0]));
            foundItems.push(item[0])
        }
        foundItems = foundItems.filter(notEmpty)
    
        return foundItems
    }

    async getItemsForContentPageWebUrls(webUrls:string[]):Promise<IDriveItem[]> {
        let foundItems:IDriveItem[] = []
        let items = await db.driveItems.where({contentType: "Document Set"}).toArray()

        for (let webUrl of webUrls) {
            let item = items.filter(driveItem => {
                if(driveItem.webUrl) {
                    return driveItem.webUrl.includes(normalizeUrl(webUrl)) 
                } 
                return false
            })
            foundItems.push(item[0])
        }
       
        foundItems = foundItems.filter(notEmpty)
        // foundItems = foundItems.filter(driveItem => (driveItem.isDocSet && driveItem.isDocSet == true))
        
        return foundItems
    }

    async getItemsForIds(uniqueIds: string[]): Promise<IDriveItem[]> {
        const driveItems = await db.driveItems.where(kUniqueId).anyOf(uniqueIds).toArray() 
        return driveItems
    }

    async rootItemsForCountry(country: string) : Promise<Array<IDriveItem> | null> {
        const items = await db.driveItems.where(kCountryRoot(country)).toArray()
        if (items[0]) {
            let rootItem = items[0] as DriveItem
            return await this.allItems(rootItem.uniqueId)
        }
        return []
    }

    async getRegionalFolderForCountry(country: string): Promise<IDriveItem | null> {
        const items = await db.driveItems.where({"country":country, "name": kRegionalFolderName}).toArray()
        return items[0] ? items[0] : null
    }

    async updateDownloadLocationForDriveItem(driveItemId:string, downloadLocation:string): Promise<any> {
        const driveItem = (await db.driveItems.where({listItemId: driveItemId}).toArray())[0]
        if(driveItem) {
            return await db.driveItems.update(driveItem, {downloadLocation: downloadLocation})
        }
    }

    async createUser() {
        const users = await db.users.where({id: "0"}).toArray()
        if(users.length <= 0) {
            await db.users.put({country: "", version: ""})
        } 
    }

    async updateCountryVersion(country?:string, version?:string): Promise<any> {
        let user = await this.getUser() 
        if (!user) {
            user = new User(country ?? "", version ?? "")
        }
        user.id = 0;
        user.country = country ? country : user.country;
        user.version = version ? version : user.version;
        return await db.users.put(user);
    }

    async createUserIfEmpty():Promise<void> {
        const user = await this.getUser()
        if(!user) {
            const countries = await this.getAllAvailableCountries()
            if (countries && countries.length > 0) {
                return await this.selectCurrentCountry(countries[0])
            }
        }
    }

    async selectCurrentCountry(country: string): Promise<void> {
        const version = await this.versionForCountry(country)
        if (version != CountryVersion.none) {
            return await this.updateCountryVersion(country, version.toString())
        }
    }

    async versionForCountry(country:string): Promise<CountryVersion> {
        const rootDriveItems = await this.rootItems();
        if (rootDriveItems) {
            const driveItemForCountry = await rootDriveItems.filter(driveItem => driveItem.name! === country)
            if (driveItemForCountry[0]) {
                const driveItemsInCountryFolder = await this.allItems(driveItemForCountry[0].uniqueId)
                if(driveItemsInCountryFolder) {
                    const foundFlex = driveItemsInCountryFolder.filter(driveItem => driveItem.name! === kFlexFileName).length > 0
                    if (foundFlex) {
                        return CountryVersion.flex
                    }
                    const foundLight = driveItemsInCountryFolder.filter(driveItem => driveItem.name! === kLightFileName).length > 0
                    if (foundLight) {
                        return CountryVersion.light
                    } 

                    return CountryVersion.none
                }
            } 
        }
        return CountryVersion.none         
    }

   

    async getUser(): Promise<IUser | null> {
        const user = await db.users.where({id: 0}).toArray()
        return user[0]
    }

    async getCurrentCountry():Promise<string | null> {
        return (await this.getUser())?.country ?? null
    }

    async getCurrentVersion():Promise<string | null> {
        return (await this.getUser())?.version ?? null
    } 

    async getAllWhitelists(): Promise<IDriveItem[]> {
        const driveItems = await db.driveItems.where({name: 'whitelist.txt'}).toArray()
        return driveItems
        // .flatMap(driveItemsToWebUrls)
        // .filter((item): item is string => !!item)
    }

    async getAllAvailableCountries(): Promise<string[] | null> {
        const driveItems = await this.rootItems()
        const driveItemsNoMaster = driveItems?.filter(driveItem => driveItem.name! !== kMasterFolderName)
        if (driveItemsNoMaster) {
            return driveItemsNoMaster?.flatMap(driveItem => driveItem.name!)
        }
        return null
    } 

    async saveWhitelists(whitelists:Array<IWhitelist>): Promise<number> {
        return await db.whitelists.bulkPut(whitelists)
    }

    async whitelistForCountry(country: string): Promise<IWhitelist> {
        return (await db.whitelists.where({country: country}).toArray())[0]
    }

    async whitelistArrayForCountry(country: string):Promise<Array<string>> {
        let whitelist = await this.whitelistForCountry(country)
        let urlArray = whitelist.content.split(",")
        return urlArray
    }

    async hasMatchingMasterFolder(country:string, webUrl: string):Promise<boolean> {
        const masterFolderWebUrl = webUrl.replace(`/${country}/`, `/${kMasterFolderName}/`)
        const driveItems = await db.driveItems.where({webUrl: masterFolderWebUrl}).toArray()
        return driveItems.length > 0
    }


    async setupInitialFavoriteGroup():Promise<any> {
        const favoriteGroups = await db.favoriteGroups.toArray()
        const hasDefaultGroup = favoriteGroups.filter(favoriteGroup => favoriteGroup.name == kDefaultFavoriteGroupName).length > 0
        if(favoriteGroups.length == 0 || hasDefaultGroup == false) {
            return await db.favoriteGroups.put({id:0, name: kDefaultFavoriteGroupName})
        }
    }

    async favoritesForFavoriteGroup(favoriteGroupName: string) : Promise<Array<IDriveItem>> {
        const favoriteItems = await db.favorites.where({favoriteGroupName: favoriteGroupName}).toArray()
        const favoriteitemIds = favoriteItems.map(favoriteItem => favoriteItem.uniqueId)

        const driveItems = await db.driveItems.where(kUniqueId).anyOf(favoriteitemIds).toArray()
        // favoriteItems.forEach(async favoriteItem => {
        //     const driveItem = (await db.driveItems.where({uniqueId: favoriteItem.uniqueId}).toArray())[0]
        //     driveItems.push(driveItem)
        // })

        return driveItems
    }

    async getFavoriteGroupsForItem(uniqueId: string):Promise<string[]> {
        const favoriteItems = await db.favorites.where({uniqueId: uniqueId}).toArray()
        return favoriteItems.map(favoriteItem => favoriteItem.favoriteGroupName)
    }

    async getAllFavoriteGroupNames(): Promise<string[]> {
        return (await db.favoriteGroups.toArray()).map(favoriteGroup => favoriteGroup.name)
    }

    async renameFavoriteGroup(id:number, newName: string): Promise<number> {
        return await db.favoriteGroups.update(id, {name: newName})
    }

    async removeFavoriteGroup(favoriteGroupName:string): Promise<number> {
        await db.favorites.where(kFavoriteGroupName).equals(favoriteGroupName).delete()
        return await db.favoriteGroups.where(kName).equals(favoriteGroupName).delete()
    }
    

    async addFavorite(uniqueId: string, favoriteGroupName: string): Promise<number> {
        return await db.favorites.put({uniqueId: uniqueId, favoriteGroupName: favoriteGroupName})
    }

    async addRemoveFavorite(uniqueId: string, favoriteGroupName: string): Promise<number> {
        const favoriteItem = await this.getFavorite(uniqueId, favoriteGroupName)
        if(favoriteItem) {
            return await this.removeFavorite(uniqueId, favoriteGroupName)
        }
        return await db.favorites.put({uniqueId: uniqueId, favoriteGroupName: favoriteGroupName})
    }

    async removeFavorite(uniqueId: string, favoriteGroupName: string): Promise<number> {
        return await db.favorites.where({uniqueId: uniqueId, favoriteGroupName: favoriteGroupName}).delete()
    }

    async getFavorite(uniqueId: string, favoriteGroupName: string): Promise<IFavorite> {
        return (await db.favorites.where({uniqueId: uniqueId, favoriteGroupName: favoriteGroupName}).toArray())[0]
    }

    async getAllCartItems(): Promise<IDriveItem[]> {
        return await db.cartItems.toArray()
    }
       

    async addCartItem(uniqueId: string): Promise<number> {
        return await db.cartItems.put({uniqueId: uniqueId})
    }

    async removeCartItem(uniqueId: string): Promise<number> {
        return await db.cartItems.where({uniqueId: uniqueId}).delete()
    }

    async removeAllCartItems(uniqueId: string): Promise<void> {
        return await db.cartItems.clear()
    }

    async saveUnzippedItem(item: IUnzippedModuleItem): Promise<any> {
        return await db.unzippedItems.put(item)
    }

    async getUnzippedItem(id?:string): Promise<IUnzippedModuleItem|undefined> {
        return (await db.unzippedItems.where({"uniqueId": id}).toArray())[0]
    }

    async getUnzippedItemIndexPath(id?:string): Promise<string | undefined> {
        return (await db.unzippedItems.where({"uniqueId": id}).toArray())[0].indexHtmlPath
    }

}
const driveItemsToWebUrls = (driveItem: IDriveItem): string | undefined => {return driveItem.webUrl}
//keys for where clauses
const kParentReferenceId = "parentReferenceId"
const kUniqueId = "uniqueId"
const kName = "name"
const kFavoriteGroupName = "favoriteGroupName"
const kWebUrl = "webUrl"

const kMasterFolderName = "master"
const kRegionalFolderName = "Regional"
const kFlexFileName = ".flex"
const kLightFileName = ".light"
const kDefaultFavoriteGroupName = "Default"

const kRoot = { parentReferenceId: config.ROOT_ID }

const kCountryRoot = (country: string) => {
    return {
        webUrl: config.ROOT_WEB_URL + country
    }
}

// Schemas for the table creation
const driveItemsSchema = "uniqueId, name, title, webUrl, serverRelativeUrl, timeLastModified, timeCreated, listItemId, listId, siteId, isDocSet, linkedFiles, linkedFolders, type, fileSize, fileExtension, timeDownloaded, downloadLocation, parentReferenceId, country, contentType"
const usersSchema = "++id, version, country"
const favoriteGroupSchema = "++id, name"
const favoriteSchema = "++id, favoriteGroupName, uniqueId"
const whitelistsSchema = "country, content"
const cartItemsSchema = "uniqueId"
const unzippedItemSchema = "uniqueId, modifiedDate, targetPath, zipPath, indexHtmlPath, driveItemId"

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
    isDocSet?: boolean;
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
    country?: string;
    contentType?: string;
    graphDownloadUrl?: string;
}

export enum DriveItemType {
    FOLDER,
    FILE,
    DOCUMENTSET,
    UNKNOWN
}

export interface IUnzippedModuleItem {
    uniqueId: string,
    driveItemId: string,
    modifiedDate: string,
    targetPath: string,
    zipPath: string,
    indexHtmlPath: string
}

export interface IUser {
    id?: number,
    version: string,
    country: string
}

export enum CountryVersion {
    flex,
    light,
    none
}

export interface IFavoriteGroup {
    id: number,
    name: string
}
export interface IWhitelist {
    country: string,
    content: string
}
export interface IFavorite {
    id?: number,
    favoriteGroupName: string,
    uniqueId: string
}

export interface ICartItem {
    uniqueId: string
}

export class User implements IUser {
    id?: number;
    country: string; 
    version: string;
    constructor(country: string, version: string) {
        this.country = country;
        this.version = version;
    }
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
    isDocSet?: boolean;
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
    country?: string;
    contentType?:string;
    graphDownloadUrl?: string;

  constructor(item:any) {
    console.log("drive item id:"+ item.id)

    this.uniqueId = item.id as string
    this.webUrl = item.webUrl ?? "";
    this.name = item.name ?? ""
    this.serverRelativeUrl = item?.serverRelativeUrl ?? ""
    this.timeLastModified = item?.lastModifiedDateTime ?? ""
    this.timeCreated = item?.timeCreated ?? ""
    this.listItemId = item?.listItemId ?? ""
    this.listId = item?.listId ?? ""
    this.siteId = item?.siteId ?? ""
    this.isDocSet = item?.contentType === "Document Set"
    this.title = item?.title ?? "" 
    this.parentReferenceId = item?.parentReference?.id ?? ""
    
    this.type = DriveItemType.UNKNOWN

    this.country = normalizeUrl(this.webUrl);
    this.country = findCountry(this.country) ?? ""
    //file specific
    this.fileSize = item?.size ?? 0
    if(item.driveItem) {
        this.graphDownloadUrl = item.driveItem["@microsoft.graph.downloadUrl"] ?? "" 
    }
    
    this.fileExtension = getExtension(this.name)
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
    isDocSet: boolean;
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
    isDocSet: boolean

    constructor(item:any) {
        //console.log(JSON.stringify(item))
        this.uniqueId = item.driveItem.id
        this.contentType = item.contentType.name
        this.title = item.fields.Title ?? ""
        this.documentDescription = item.fields.DocumentSetDescription ?? ""
        this.linkedFiles = item.fields.Linked_x0020_files ?? ""
        this.linkedFolders = item.fields.Linked_x0020_folders ?? ""
        this.type = item.contentType.name === "Folder" ? DriveItemType.FOLDER : DriveItemType.FILE
        this.type = item.contentType.name === "Document Set" ? DriveItemType.DOCUMENTSET : this.type
        this.isDocSet = this.type === DriveItemType.DOCUMENTSET

        this.listItemId = item.id
    }
}
export interface IThumbnail {
    uniqueId: string,
    smallUrl: string,
    mediumUrl: string,
    largeUrl: string
}
export class Thumbnail implements IThumbnail {
   uniqueId: string
    smallUrl: string = ""
    mediumUrl: string = ""
    largeUrl: string = ""

    constructor(response: any) {
        this.uniqueId = response?.id
        const thumbnailObject = response?.thumbnails[0]
        if(thumbnailObject) {
            this.smallUrl = thumbnailObject.small?.url ?? ""
            this.mediumUrl = thumbnailObject.medium?.url ?? ""
            this.largeUrl = thumbnailObject.large?.url ?? ""
        }
    }
}

export class Whitelist implements IWhitelist {
    whitelistPaths = Array<string>()
    constructor(public country:string, public content:string) {
        this.whitelistPaths = content.split(",")
    }
}

//do we really need this?
// we should rather save favorites as json so updates don't lose favorites
// export interface IFavoriteGroup {

// }

// export interface IFavoriteItem {
    
// }

export var db = new AppDatabase();
