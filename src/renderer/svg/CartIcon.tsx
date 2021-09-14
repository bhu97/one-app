import React, { FC } from 'react';

import theme from '../theme';
import { IMenuIconProps } from './IMenuIconProps';

export const CartIcon: FC<IMenuIconProps> = ({ isSelected }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25.5"
    height="24.409"
    viewBox="0 0 25.5 24.409"
  >
    <g transform="translate(0.75 0.75)">
      <path
        d="M14.182,31.091A1.091,1.091,0,1,1,13.091,30,1.091,1.091,0,0,1,14.182,31.091Z"
        transform="translate(-4.364 -9.273)"
        fill="transparent"
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
        d="M30.682,31.091A1.091,1.091,0,1,1,29.591,30,1.091,1.091,0,0,1,30.682,31.091Z"
        transform="translate(-8.864 -9.273)"
        fill="transparent"
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
        d="M1.5,1.5H5.864L8.787,16.107a2.182,2.182,0,0,0,2.182,1.756h10.6a2.182,2.182,0,0,0,2.182-1.756L25.5,6.955H6.955"
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
    </g>
  </svg>
);
