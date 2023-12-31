import { DriveItem, ListItem, Thumbnail } from '../database/database';

export const responseToDriveItem = (response: any) => {
  return new DriveItem(response);
};
export const responseToListItem = (response: any) => new ListItem(response);
export const responseToThumbnail = (response: any) => new Thumbnail(response);

export const getExtension = (fileName: string): string => {
  var re = /(?:\.([^.]+))?$/;
  let extension = re.exec(fileName)?.[1];
  return extension ?? '';
};
