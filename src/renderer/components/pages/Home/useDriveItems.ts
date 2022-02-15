import React, { useEffect, useState } from 'react';

import { IDriveItem } from '../../../database/database';
import { FlexLightStoreFactory } from '../../../database/stores/FlexLightStoreFactory';
import { useTracking } from '../../../TrackingManager';
import { normalizeUrl } from '../../../utils/helper';

export const useDriveItems = (
  mainRef: React.MutableRefObject<HTMLDivElement | null>,
  isMetadataLoading: boolean,
  initialRoute: IDriveItem[],
  onRouteChanged: (currentRoute: IDriveItem[]) => void
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<IDriveItem[]>(initialRoute);

  const [items, setItems] = useState<IDriveItem[][]>([]);

  const getRootData = async () => {
    console.log("get root data")
    try {
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
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
    
  };

  const getFileListData = async (uniqueId: string) => {
    const query =
      uniqueId === 'home'
        ? undefined
        : {
            query: uniqueId,
          };
    const store = await FlexLightStoreFactory.getStoreForCurrentUser(query);
    await store?.update();
    return store?.items ?? [];
  };

  useEffect(() => {
    if (!isMetadataLoading) {
      getRootData();
    }
  }, [isMetadataLoading]);
  //tracking
  const { trackContentPage } = useTracking()

  const onDriveItemSelected = async (
    item: IDriveItem,
    index: number,
    fromBreadcrumbs = false
  ) => {
    
    if (item.contentType === 'Document Set') {
      trackContentPage(
        item.name ?? "", 
        item.country ?? "", 
        normalizeUrl(item.webUrl ?? "")
      )
    }

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
    console.log(mainRef.current?.parentElement?.parentElement);
    
    mainRef.current?.parentElement?.scrollTo({
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
