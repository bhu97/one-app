import React, { useEffect, useState } from 'react';

import { db, IDriveItem } from '../../../../database/database';
import { FlexStore } from '../../../../database/stores/FlexStore';

export const useDriveItems = (
  mainRef: React.MutableRefObject<HTMLDivElement | null>
) => {
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
  const [currentRoute, setCurrentRoute] = useState<IDriveItem[]>([
    {
      uniqueId: 'home',
      title: 'Home',
    },
  ]);

  const [items, setItems] = useState<IDriveItem[][]>([]);

  const getRootData = async () => {
    const store = new FlexStore({});
    await store.update();
    setItems([store.items]);
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

  const onDriveItemSelected = async (
    item: IDriveItem,
    index: number,
    fromBreadcrumbs = false
  ) => {
    const ancestors = [...items.slice(0, index + 1)];
    const ancestorsRoute = [...currentRoute.slice(0, index + 1)];
    const levelItems = await getFileListData(item.uniqueId);
    if (fromBreadcrumbs) {
      setItems(ancestors);
      setCurrentRoute(ancestorsRoute);
    } else {
      setItems([...ancestors, levelItems]);
      setCurrentRoute([...ancestorsRoute, item]);
    }
    mainRef.current?.parentElement?.parentElement?.scrollTo({
      left: 10000,
      behavior: 'smooth',
    });
  };

  const onBreadcrumbItemSelected = async (item: IDriveItem, index: number) => {
    await onDriveItemSelected(item, index, true);
  };
  return {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
  };
};

export default useDriveItems;
