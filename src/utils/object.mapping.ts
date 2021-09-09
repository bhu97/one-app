import { DriveItem, ListItem } from "database/database";

export const responseToDriveItem = (response: any) => {
  console.log("response: "+response.id);
  return new DriveItem(response)
};
export const responseToListItem = (response: any) => new ListItem(response);