import { useEffect, useState } from 'react';

import { IDriveItem, Thumbnail } from '../database/database';
import { IStore } from '../database/stores/AbstractStore';
import { dataManager } from '../DataManager';
import { makePromise } from './promises';

export const useGetFilesData = (
  currentStore: Promise<IStore | undefined> | IStore | undefined,
  thumbnailsUniqueId?: string
) => {
  const [items, setItems] = useState<IDriveItem[]>([]);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  const getData = async () => {
    const store = await makePromise(currentStore);
    if (!store) return;
    await store.update();
    setItems(store.items);
    let newThumbnails: (Thumbnail | null)[];
    try {
      if (thumbnailsUniqueId) {
        newThumbnails = await dataManager.getThumbnails(thumbnailsUniqueId);
      } else {
        newThumbnails = await Promise.all(
          store.items.map((item) =>
            item ? dataManager.getItemThumbnail(item.uniqueId) : null
          )
        );
      }
    } catch (e) {
      newThumbnails = [];
    }
    setThumbnails(newThumbnails.filter((item) => item) as Thumbnail[]);
  };
  useEffect(() => {
    getData();
  }, [thumbnailsUniqueId]);

  return { items, thumbnails };
};

export default useGetFilesData;
