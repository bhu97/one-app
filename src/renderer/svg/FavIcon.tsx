import React, { FC } from 'react';

import theme from '../theme';
import { IMenuIconProps } from './IMenuIconProps';

export const FavIcon: FC<IMenuIconProps> = ({ isSelected }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25.5"
    height="24.324"
    viewBox="0 0 25.5 24.324"
  >
    <path
      d="M15,3l3.708,7.512L27,11.724l-6,5.844,1.416,8.256L15,21.924l-7.416,3.9L9,17.568,3,11.724l8.292-1.212Z"
      transform="translate(-2.25 -2.25)"
      fill={isSelected ? theme.palette.primary.main : 'transparent'}
      stroke={
        isSelected ? theme.palette.primary.main : theme.palette.background.paper
      }
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
