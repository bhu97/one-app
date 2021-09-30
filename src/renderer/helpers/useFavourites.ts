import { toast } from 'material-react-toastify';
import { useEffect, useRef, useState } from 'react';

import { IFavoriteGroup } from '../database/database';
import { FavoriteStore } from '../database/stores/FavoriteStore';
import useGetFilesData from './useGetFilesData';

export const useFavourites = () => {
  const [favoriteGroups, setFavoriteGroups] = useState<IFavoriteGroup[]>([]);
  const [selectedFavoriteGroups, setSelectedFavoriteGroups] = useState<
    string[]
  >([]);
  const [currentFavoriteGroup, setCurrentFavoriteGroup] =
    useState<string>('Default');
  const favoriteStoreRef = useRef(new FavoriteStore({ query: 'Default' }));
  const { items, thumbnails, updateItems } = useGetFilesData(
    favoriteStoreRef.current
  );
  const getData = async () => {
    const favs = await favoriteStoreRef.current.getAllFavoriteGroups();
    setFavoriteGroups(favs);
  };
  const getSelectedFavoriteGroups = async (uniqueId: string) => {
    const groups = await favoriteStoreRef.current.getFavoriteGroupsForItem(
      uniqueId
    );
    setSelectedFavoriteGroups(groups);
  };
  const selectFavouriteGroupForItem = async (
    uniqueId: string,
    groupName: string,
    selected: boolean
  ) => {
    if (selected) {
      try {
        await favoriteStoreRef.current.addFavoriteToGroup(uniqueId, groupName);
        await favoriteStoreRef.current.update();
        await getSelectedFavoriteGroups(uniqueId);
        toast.success(`Added item to ${groupName}`);
      } catch (e) {
        console.error(e);
        toast.error(`Couldn't add item to ${groupName}`);
      }
    } else {
      try {
        await favoriteStoreRef.current.removeFavoriteFromGroup(
          uniqueId,
          groupName
        );
        await favoriteStoreRef.current.update();
        await getSelectedFavoriteGroups(uniqueId);
        toast.success(`Removed item from ${groupName}`);
      } catch (e) {
        console.error(e);
        toast.error(`Couldn't remove item from ${groupName}`);
      }
    }
  };
  const selectFavouriteGroup = async (groupName: string) => {
    setCurrentFavoriteGroup(groupName);
    const newStore = new FavoriteStore({ query: groupName });
    favoriteStoreRef.current = newStore;
    updateItems(newStore);
  };
  const addGroup = async (groupName: string) => {
    await favoriteStoreRef.current.addFavoriteGroup(groupName);
    await favoriteStoreRef.current.update();
    await getData();
  };
  const removeGroup = async (groupName: string) => {
    await favoriteStoreRef.current.removeFavoriteGroup(groupName);
    await favoriteStoreRef.current.update();
    await getData();
    selectFavouriteGroup('Default');
  };
  const renameGroup = async (id: number, groupName: string) => {
    await favoriteStoreRef.current.renameFavoriteGroup(id, groupName);
    await favoriteStoreRef.current.update();
    await getData();
    selectFavouriteGroup(groupName);
  };
  useEffect(() => {
    getData();
  }, []);
  return {
    currentFavoriteGroup,
    items,
    thumbnails,
    favoriteGroups,
    selectedFavoriteGroups,
    getSelectedFavoriteGroups,
    selectFavouriteGroupForItem,
    updateItems,
    selectFavouriteGroup,
    addGroup,
    removeGroup,
    renameGroup,
  };
};

export default useFavourites;
