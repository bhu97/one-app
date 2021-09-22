import React, { useEffect, useState } from 'react';

import { db, IDriveItem } from '../../../../database/database';
import { FlexLightStoreFactory } from '../../../../database/stores/FlexLightStoreFactory';

export const useDriveItems = (
  mainRef: React.MutableRefObject<HTMLDivElement | null>,
  initialRoute: IDriveItem[],
  onRouteChanged: (currentRoute: IDriveItem[]) => void
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
  const [currentRoute, setCurrentRoute] = useState<IDriveItem[]>(initialRoute);

  const [items, setItems] = useState<IDriveItem[][]>([]);

  const getRootData = async () => {
    const store = await FlexLightStoreFactory.getStoreForCurrentUser({});
    if (!store) {
      setIsLoading(false);
      return;
    }
    await store.update();
    const currentItems = [store.items];
    if (initialRoute?.length > 1) {
      for (const item of initialRoute) {
        if (item.uniqueId === 'home') continue;
        const levelItems = await getFileListData(item.uniqueId);
        currentItems.push(levelItems);
      }
    }
    setItems(currentItems);
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
      onRouteChanged(ancestorsRoute);
    } else {
      setItems([...ancestors, levelItems]);
      setCurrentRoute([...ancestorsRoute, item]);
      onRouteChanged([...ancestorsRoute, item]);
    }
    mainRef.current?.parentElement?.parentElement?.scrollTo({
      left: 10000,
      behavior: 'smooth',
    });
  };

  const onBreadcrumbItemSelected = async (item: IDriveItem, index: number) => {
    await onDriveItemSelected(item, index, true);
  };

  const onBackButtonClicked = async () => {
    onDriveItemSelected(
      currentRoute[currentRoute.length - 2],
      currentRoute.length - 2,
      true
    );
  };
  return {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
    onBackButtonClicked,
  };
};

export default useDriveItems;
