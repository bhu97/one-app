import { List, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'database/database';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexBasis: '300px',
      padding: theme.spacing(2, 4),
      marginLeft: theme.spacing(3),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
    },
  })
);

interface ILinkedItemsProps {
  documentSet: IDriveItem;
}

export const LinkedItems: FC<ILinkedItemsProps> = ({ documentSet }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2">More information</Typography>
      <List>ITEMS HERE</List>
    </div>
  );
};

export default LinkedItems;
