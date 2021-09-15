import { Hidden, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

import { IMenuIconProps } from '../../../svg/IMenuIconProps';

const useStyles = makeStyles((theme) => ({
  menuItem: {
    padding: `${theme.spacing(1, 3)} !important`,
    minHeight: theme.spacing(7),
    marginBottom: theme.spacing(2),
    fill: theme.palette.primary.main,
    stroke: theme.palette.background.paper,
    backgroundColor: 'transparent',
    color: theme.palette.background.paper,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
    '&:hover': {
      fill: theme.palette.primary.main,
      stroke: theme.palette.background.paper,
      backgroundColor: 'transparent',
      color: theme.palette.background.paper,
    },
    '&.Mui-selected': {
      fill: theme.palette.primary.main,
      stroke: theme.palette.background.paper,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.main,
      '&:hover': {
        fill: theme.palette.primary.main,
        stroke: theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
      },
    },
  },
  icon: {
    [theme.breakpoints.down('md')]: {
      minWidth: 'unset',
    },
  },
}));

export interface IMenuItemProps {
  disabled: boolean;
  Icon: (props: IMenuIconProps) => JSX.Element | null;
  text: string;
  url: string;
}

export const MenuItem: FC<IMenuItemProps> = ({ disabled, Icon, text, url }) => {
  const location = useLocation();
  const isSelected = matchPath(location.pathname, url) !== null;
  const styles = useStyles();
  return (
    <ListItem
      key={url}
      component={Link}
      to={url}
      selected={isSelected}
      classes={{
        root: styles.menuItem,
      }}
      button
      disabled={disabled}
    >
      <ListItemIcon
        classes={{
          root: styles.icon,
        }}
      >
        {Icon ? <Icon isSelected={isSelected} /> : null}
      </ListItemIcon>
      <Hidden mdDown>
        <ListItemText primary={text} />
      </Hidden>
    </ListItem>
  );
};

export default MenuItem;
