import { useEffect, useState } from 'react';

import { db, IDriveItem } from '../../../../database/database';

export const useDriveItems = () => {
  /*
    const setupDummyData = async () => {
      if (await db.isEmpty()) {
        setState({ ...state, isLoading: true });

        let deltaResponse = await fetch('./../../../assets/delta.json');
        let deltaResponseJson = await deltaResponse.json();
        //console.log(deltaResponseJson.value[0]);
        let driveItems = deltaResponseJson.value.map(responseToDriveItem);
        await db.save(driveItems);

        let listitemResponse = await fetch('./../../../assets/listitem.json');
        let listitemResponseJson = await listitemResponse.json();
        console.log(listitemResponseJson.value[0]);
        let listItems = listitemResponseJson.value.map(responseToListItem);
        await db.saveMetaData(listItems);

        setState({ ...state, isLoading: false });
      }
    };
  */

  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<IDriveItem[]>([]);

  const [items, setItems] = useState<Array<Array<IDriveItem>>>([]);

  const getRootData = async () => {
    const rootItems = (await db.rootItemsForCountry('master')) ?? [];
    setItems([...items, rootItems]);
    setIsLoading(false);
  };

  const getFileListData = async (uniqueId: string) => {
    return (await db.allItems(uniqueId)) ?? [];
  };

  useEffect(() => {
    getRootData();
  }, []);

  // get the first level data
  // this happens by country code
  // TODO: change country code to dynamic value

  const onDriveItemSelected = async (item: IDriveItem, index: number) => {
    const ancestors = [...items.slice(0, index + 1)];
    const ancestorsRoute = [...currentRoute.slice(0, index)];
    const levelItems = await getFileListData(item.uniqueId);
    setItems([...ancestors, levelItems]);
    setCurrentRoute([...ancestorsRoute, item]);
  };
  return { isLoading, items, currentRoute, onDriveItemSelected };
};

export default useDriveItems;
