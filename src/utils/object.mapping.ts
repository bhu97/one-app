import { DriveItem, ListItem } from "database/database";

export const responseToDriveItem = (response: any) => new DriveItem(response);
export const responseToListItem = (response: any) => new ListItem(response);