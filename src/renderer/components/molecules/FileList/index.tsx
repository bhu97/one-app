import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'database/database';
import React, { FC } from 'react';

import { FileItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(2),
      padding: theme.spacing(2, 4),
      marginBottom: theme.spacing(3),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
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
