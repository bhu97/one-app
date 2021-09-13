import Dexie from 'dexie';
import { findCountry, normalizeUrl } from './../utils/helper';
import config from './../utils/application.config.release'
export class AppDatabase extends Dexie {

    driveItems: Dexie.Table<IDriveItem, number>;
    users: Dexie.Table<IUser, number>;
    favoriteGroups: Dexie.Table<IFavoriteGroup, number>;
    favorites: Dexie.Table<IFavorite, number>;
    whitelists: Dexie.Table<IWhitelist, number>;

    constructor() {

        super("OneDatabase");

        var db = this;

        db.version(1).stores({
            driveItems: driveItemsSchema,
            users: usersSchema,
            favoriteGroups: favoriteGroupSchema,
            favorites: favoriteSchema,
            whitelists: whitelistsSchema
        });

        this.driveItems = this.table("driveItems");
        this.users = this.table("users");
        this.whitelists = this.table("whitelists");
        this.favoriteGroups = this.table("favoriteGroups");
        this.favorites = this.table("favorites");
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

    async getItemsForWebUrls(weburls: string[]): Promise<IDriveItem[]> {
        return await db.driveItems.where(kWebUrl).anyOf(weburls).toArray()
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

    async getAllWhitelistUrls(): Promise<string[]> {
        const driveItems = await db.driveItems.where({name: 'whitelist.txt'}).toArray()
        return driveItems
        .flatMap(driveItemsToWebUrls)
        .filter((item): item is string => !!item)
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

const kRoot = {
    parentReferenceId: "01GX2IG4N6Y2GOVW7725BZO354PWSELRRZ"
}

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

  constructor(item:any) {
    console.log("drive item id:"+ item.id)

    this.uniqueId = item.id as string
    this.webUrl = item.webUrl ?? "";
    this.name = item.name ?? ""
    this.serverRelativeUrl = item?.serverRelativeUrl ?? ""
    this.timeLastModified = item?.timeLastModified ?? ""
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
