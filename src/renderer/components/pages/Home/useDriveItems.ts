import React, { useEffect, useState } from 'react';

import { IDriveItem } from '../../../database/database';
import { FlexLightStoreFactory } from '../../../database/stores/FlexLightStoreFactory';

export const useDriveItems = (
  mainRef: React.MutableRefObject<HTMLDivElement | null>,
  initialRoute: IDriveItem[],
  onRouteChanged: (currentRoute: IDriveItem[]) => void
) => {
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
        const levelItems = await getFileListData(store, item.uniqueId);
        currentItems.push(levelItems);
      }
    }
    setItems(currentItems);
    setIsLoading(false);
  };

  const getFileListData = async (uniqueId: string) => {
    const store = await FlexLightStoreFactory.getStoreForCurrentUser({
      query: uniqueId,
    });
    await store?.update();
    return store?.items ?? [];
  };

  useEffect(() => {
    getRootData();
  }, []);

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

  const onLinkedDocumentSetSelected = async (documentSet: IDriveItem) => {
    await onDriveItemSelected(documentSet, items.length, false);
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
    onLinkedDocumentSetSelected,
    onBackButtonClicked,
  };
};

export default useDriveItems;
