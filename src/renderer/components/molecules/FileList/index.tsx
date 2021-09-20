import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'database/database';
import React, { FC } from 'react';

import { FileItem } from '../../atoms';

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

interface IFileListProps {
  items: IDriveItem[];
}

export const FileList: FC<IFileListProps> = ({ items }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {items.map((item) => (
        <FileItem key={item.uniqueId} item={item} />
      ))}
    </List>
  );
};

export default FileList;
