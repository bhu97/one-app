import { useEffect, useRef, useState } from 'react';

import { IDriveItem } from './database/database';
import { dataManager } from './DataManager';

export const useAppCore = () => {
  const defaultRoute = [
    {
      uniqueId: 'home',
      title: 'Home',
    },
  ];
  const currentRouteRef = useRef<IDriveItem[]>(defaultRoute);
  const onRouteChanged = (currentRoute?: IDriveItem[]) => {
    currentRouteRef.current = currentRoute || defaultRoute;
  };
  const [isLoading, setIsLoading] = useState(false);
  const loadUserSettings = async () => {
    setIsLoading(true);
    const state = await dataManager.getAppState();
    if (!state.login || !state.token) {
      await dataManager.login();
    }
    const newState = await dataManager.getAppState();
    console.log(newState);
    setIsLoading(false);
  };
  useEffect(() => {
    loadUserSettings();
  }, []);
  return {
    isLoading,
    currentRoute: currentRouteRef.current,
    onRouteChanged,
  };
};

export default useAppCore;
