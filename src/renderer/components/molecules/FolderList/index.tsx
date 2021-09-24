import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'renderer/database/database';
import React, { FC } from 'react';

import { FolderItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxWidth: '340px',
      minWidth: '340px',
      marginRight: theme.spacing(3),
    },
    listItemText: {
      whiteSpace: 'nowrap',
    },
  })
);

interface IFolderListProps {
  items: IDriveItem[];
  selectedItem: IDriveItem | undefined;
  onDriveItemSelected: (item: IDriveItem) => void;
}

export const FolderList: FC<IFolderListProps> = ({
  items,
  selectedItem,
  onDriveItemSelected,
}) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {items.map((item) => (
        <FolderItem
          key={item.uniqueId}
          isSelected={item.uniqueId === selectedItem?.uniqueId}
          item={item}
          onDriveItemSelected={onDriveItemSelected}
        />
      ))}
    </List>
  );
};

export default FolderList;
