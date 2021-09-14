import React, { FC } from 'react';

import theme from '../theme';
import { IMenuIconProps } from './IMenuIconProps';

export const SettingsIcon: FC<IMenuIconProps> = ({ isSelected }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25.5"
    height="25.5"
    viewBox="0 0 25.5 25.5"
  >
    <g transform="translate(0.75 0.75)">
      <path
        d="M21.573,16.773a1.8,1.8,0,0,0,.36,1.985l.065.065a2.183,2.183,0,1,1-3.087,3.087l-.065-.065a1.815,1.815,0,0,0-3.076,1.287v.185a2.182,2.182,0,1,1-4.364,0v-.1a1.8,1.8,0,0,0-1.178-1.647,1.8,1.8,0,0,0-1.985.36L8.176,22a2.183,2.183,0,1,1-3.087-3.087l.065-.065a1.815,1.815,0,0,0-1.287-3.076H3.682a2.182,2.182,0,1,1,0-4.364h.1a1.8,1.8,0,0,0,1.647-1.178,1.8,1.8,0,0,0-.36-1.985L5,8.176A2.183,2.183,0,1,1,8.089,5.089l.065.065a1.8,1.8,0,0,0,1.985.36h.087a1.8,1.8,0,0,0,1.091-1.647V3.682a2.182,2.182,0,0,1,4.364,0v.1a1.815,1.815,0,0,0,3.076,1.287L18.824,5a2.183,2.183,0,1,1,3.087,3.087l-.065.065a1.8,1.8,0,0,0-.36,1.985v.087a1.8,1.8,0,0,0,1.647,1.091h.185a2.182,2.182,0,0,1,0,4.364h-.1A1.8,1.8,0,0,0,21.573,16.773Z"
        transform="translate(-1.5 -1.5)"
        fill={isSelected ? theme.palette.primary.main : 'transparent'}
        stroke={
          isSelected
            ? theme.palette.primary.main
            : theme.palette.background.paper
        }
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M17.556,15.528A2.028,2.028,0,1,1,15.528,13.5,2.028,2.028,0,0,1,17.556,15.528Z"
        transform="translate(-3.528 -3.528)"
        fill={theme.palette.primary.main}
        stroke={theme.palette.background.paper}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);
