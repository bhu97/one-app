import { useEffect, useState } from 'react';

import { db } from '../../../database/database';
import { localStorgeHelper } from '../../../database/storage';
import { dataManager } from '../../../DataManager';
import { fetchLastModifiedDate } from '../../fetch';

export const useAppSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryVersion, setCountryVersion] = useState<string>('');
  const [appVersion, setAppVersion] = useState<string>('');
  const [modifiedDate, setModifiedDate] = useState<string>('Unknown');
  const getCurrentSettings = async () => {
    try {
      const preselectedCountry = await db.getCurrentCountry();
      if (preselectedCountry) {
        setSelectedCountry(preselectedCountry);
      }
      const preselectedCountryVersion = await db.getCurrentVersion();
      if (preselectedCountryVersion) {
        setCountryVersion(preselectedCountryVersion === '0' ? 'flex' : 'light');
      }
      const preselectedAppVersion = 'v1.0.0.0'; // TODO db.version();
      if (preselectedAppVersion) {
        setAppVersion(preselectedAppVersion);
      }
      const loadLastModifiedDate = async () => {
        const authResult =
          await window.electron.ipcRenderer.refreshTokenSilently();
        const token = authResult.accessToken;
        if (token) {
          const date = await fetchLastModifiedDate(token);
          localStorgeHelper.setLastModifiedDate(date);
          setModifiedDate(localStorgeHelper.getLastModifiedDate() ?? 'Unknown');
        }
      };
      loadLastModifiedDate();
    } catch (e) {
      console.error(e);
    }
  };
  const onUpdateNow = async () => {
    setIsLoading(true);
    await dataManager.getMetaData();
    setIsLoading(false);
  };
  const onCountrySelected = async (countryName: string) => {
    setIsLoading(true);
    await db.selectCurrentCountry(countryName);
    await getCurrentSettings();
    setIsLoading(false);
  };
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      const allCountries = await db.getAllAvailableCountries();
      if (allCountries) {
        setCountries(allCountries);
      }
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
  };
};

export default useAppSettings;
