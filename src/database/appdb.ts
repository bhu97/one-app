import Dexie from 'dexie';

export class AppDatabase extends Dexie {

    constructor() {

        super("OneDatabase");

        var db = this;

        db.version(1).stores({
            driveItems: '++id, firstName, lastName',
        });
    }
}

export interface IDriveItem {
    id?: number;
    uniqueId: string;
    name: string;
    webUrl: string;
    serverRelativeUrl: string;
    timeLastModified: string;
    timeCreated: string;
    listItemId: string;
    listId: string;
    siteId: string;
    isDoclib: boolean;
    title: string;
    linkedFiles: string;
    linkedFolders: string;
    type: DriveItemType;
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


//do we really need this?
// we should rather save favorites as json so updates don't lose favorites
export interface IFavoriteGroup {

}

export interface IFavoriteItem {
    
}

export var db = new AppDatabase();
