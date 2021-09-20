import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { IDriveItem } from '../../../../database/database';

const useStyles = makeStyles((theme) => ({
  root: {
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
    downloaded: {
      borderColor: theme.palette.primary.main,
    },
    outdated: {
      borderColor: theme.palette.error.main,
    },
  },
}));

export interface IFileItemProps {
  item: IDriveItem;
}

export const FileItem: FC<IFileItemProps> = ({ item }) => {
  const styles = useStyles();
  const { uniqueId, name, title } = item;
  const text = title || name;
  return (
    <ListItem
      key={uniqueId}
      classes={{
        root: styles.root,
      }}
      button
    >
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default FileItem;
