import { ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { IDriveItem } from '../../../database/database';
import { NextArrowIcon } from '../../../svg';

const useStyles = makeStyles((theme) => ({
  folderItem: {
    padding: `${theme.spacing(1, 3)} !important`,
    marginBottom: theme.spacing(3),
    minHeight: theme.spacing(7),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    borderLeftWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.grey[600],
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.grey[600],
      '&:hover': {
        backgroundColor: theme.palette.grey[600],
      },
    },
    '&.downloaded': {
      borderColor: theme.palette.primary.main,
    },
    '&.outdated': {
      borderColor: theme.palette.error.main,
    },
  },
  icon: {
    minWidth: 'unset',
  },
  text: {
    fontWeight: 700,
  },
}));

export interface IFolderItemProps {
  item: IDriveItem;
  isSelected: boolean;
  onDriveItemSelected: (item: IDriveItem) => void;
}

export const FolderItem: FC<IFolderItemProps> = ({
  item,
  isSelected,
  onDriveItemSelected,
}) => {
  const styles = useStyles();
  const { uniqueId, name, title } = item;
  const text = title || name;
  return (
    <ListItem
      key={uniqueId}
      selected={isSelected}
      classes={{
        root: styles.folderItem,
      }}
      button
      onClick={() => onDriveItemSelected(item)}
    >
      <ListItemText classes={{ primary: styles.text }} primary={text} />
      <ListItemIcon
        classes={{
          root: styles.icon,
        }}
      >
        {NextArrowIcon}
      </ListItemIcon>
    </ListItem>
  );
};

export default FolderItem;
