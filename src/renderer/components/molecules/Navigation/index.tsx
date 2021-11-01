import { List } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import { CartIcon, FavIcon, HomeIcon, SettingsIcon } from '../../../svg';
import { IMenuItemProps, MenuItem } from '../../atoms';

interface INavigationProps {
  navigationEnabled: boolean;
}

export const Navigation: FunctionComponent<INavigationProps> = ({
  navigationEnabled,
}) => {
  const disabled = !navigationEnabled;
  const menuItems: IMenuItemProps[] = [
    {
      disabled,
      Icon: HomeIcon,
      text: 'Home',
      url: '/home',
    },
    {
      disabled,
      Icon: FavIcon,
      text: 'Favourites',
      url: '/favorites',
    },
    {
      disabled,
      Icon: CartIcon,
      text: 'Cart',
      url: '/cart',
    },
    {
      disabled,
      Icon: SettingsIcon,
      text: 'Settings',
      url: '/settings',
    },
    {
      disabled,
      Icon: SettingsIcon,
      text: 'Dev Settings',
      url: '/devsettings',
    },
  ];
  return <List>{menuItems.map(MenuItem)}</List>;
};

export default Navigation;
