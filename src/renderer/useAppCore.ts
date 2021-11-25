import { toast } from 'material-react-toastify';
import { useEffect, useRef, useState } from 'react';

import { IDriveItem } from './database/database';
import { localStorgeHelper } from './database/storage';
import { dataManager } from './DataManager';
import { LoginState, MetaDataState, SessionState } from './utils/constants';

export const useAppCore = () => {
  const defaultRoute = [
    {
      uniqueId: 'home',
      title: 'Home',
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [isOutdated, setIsOutdated] = useState(false);
  const currentRouteRef = useRef<IDriveItem[]>(defaultRoute);
  const onRouteChanged = (currentRoute?: IDriveItem[]) => {
    currentRouteRef.current = currentRoute || defaultRoute;
  };
  const onOutdatedDismiss = () => {
    localStorgeHelper.setSupressWarningDate();
    setIsOutdated(false);
  };
  const onMetadataUpdate = async () => {
    console.log("metadata update");
    
    setIsLoading(true);
    try {
      await dataManager.getMetaData();
      setIsOutdated(false);
    } catch (e) {
      toast.error(`Couldn't update metadata`);
    }
    setIsLoading(false);
  };
  const loadUserSettings = async () => {
    console.log("load user settings update");
    setIsLoading(true);
    try {
      const state = await dataManager.getAppState();
      if (
        state.login !== LoginState.LOGGED_IN ||
        state.session !== SessionState.SESSION_VALID
      ) {
        console.log("try to login");
        
        await dataManager.login();
      }
      if (
        state.metadata !== MetaDataState.VALID &&
        state.metadata !== MetaDataState.HAS_UPDATES
      ) {
        await dataManager.getMetaData();
      }
      if (state.metadata === MetaDataState.HAS_UPDATES) {
        setIsOutdated(true);
      }
    } catch (e) {
      console.error(e);
      toast.error(`Can't load app state!`);
    }
    console.log("load user settings update finish");
    setIsLoading(false);
  };
  useEffect(() => {
    loadUserSettings();
  }, []);
  return {
    isLoading,
    currentRouteRef,
    onRouteChanged,
    isOutdated,
    onMetadataUpdate,
    onOutdatedDismiss,
  };
};

export default useAppCore;
