import { toast } from 'material-react-toastify';
import { useEffect, useRef, useState } from 'react';

import SettingsStore from '../../../database/stores/SettingsStore';
import { dataManager } from '../../../DataManager';
import { IAppState } from '../../../utils/constants';

export const useAppSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] =
    useState<string | undefined>('');
  const [countryVersion, setCountryVersion] = useState<string | undefined>('');
  const [appVersion, setAppVersion] = useState<string>('');
  const [modifiedDate, setModifiedDate] = useState<string>('Unknown');
  const [appState, setAppState] = useState<IAppState | undefined>(undefined);
  const settingsStoreRef = useRef(new SettingsStore({}));
  const login = async () => {
    setIsLoading(true);
    try {
      await dataManager.login();
    } catch (e) {
      toast.error(`Couldn't login`);
    }
    setIsLoading(false);
  };
  const getCurrentSettings = async () => {
    try {
      setSelectedCountry(settingsStoreRef.current.currentCountry);
      setCountryVersion(
        settingsStoreRef.current.currentVersion === '0' ? 'flex' : 'light'
      );
      setAppVersion(`v${settingsStoreRef.current.appVersion}`);
      setModifiedDate(settingsStoreRef.current.lastUpdate ?? 'Unknown');
      const state = await dataManager.getAppState();
      setAppState(state);
    } catch (e) {
      toast.error("Couldn't load settings");
      console.error(e);
    }
  };
  const onUpdateNow = async () => {
    setIsLoading(true);
    try {
      await dataManager.getMetaData();
    } catch (e) {
      console.log(e);
      toast.error(`Couldn't get metadata`);
    }
    setIsLoading(false);
  };
  const onCountrySelected = async (countryName: string) => {
    setIsLoading(true);
    try {
      await settingsStoreRef.current.selectCountry(countryName);
      await settingsStoreRef.current.update();
      await getCurrentSettings();
    } catch (e) {
      toast.error("Couldn't select country");
      console.error(e);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      await settingsStoreRef.current.update();
      setCountries(settingsStoreRef.current.allAvailableCountries);
      await getCurrentSettings();
      setIsLoading(false);
    };
    loadCountries();
  }, []);
  return {
    isLoading,
    onCountrySelected,
    countries,
    selectedCountry,
    countryVersion,
    appVersion,
    modifiedDate,
    onUpdateNow,
    appState,
    login,
  };
};

export default useAppSettings;
