import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'database/database';
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

type FileListProps = {
  items: Array<IDriveItem>;
  selectedItem: (id: string, index: number) => void;
  index: number;
};

const FileList: FC<FileListProps> = ({ items, selectedItem, index }) => {
  const classes = useStyles();

  const pressedItem = (uniqueId: string, pressedIndex: number) => {
    selectedItem(uniqueId, pressedIndex);
  };

  return (
    <List className={classes.root}>
      {items.map((item) => (
        <FolderItem
          key={item.uniqueId}
          item={item}
          onClick={(id: string) => pressedItem(id, index)}
        />
      ))}
    </List>
  );
};

export default FileList;
