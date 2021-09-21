import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { IDriveItem } from '../../../../database/database';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 0),
    backgroundColor: theme.palette.background.paper,
  },
  breadcrumbItem: {
    padding: theme.spacing(0),
    minHeight: theme.spacing(4),
    width: 'unset',
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  text: {
    fontWeight: 700,
    paddingLeft: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  svg: {
    fill: theme.palette.background.paper,
    flexShrink: 0,
    height: theme.spacing(6),
    zIndex: 10,
  },
}));

export interface IBreadcrumbItemProps {
  item: IDriveItem;
  isFirst: boolean;
  zIndex: number;
  onDriveItemSelected: (item: IDriveItem) => void;
}

export const BreadcrumbItem: FC<IBreadcrumbItemProps> = ({
  item,
  isFirst,
  zIndex,
  onDriveItemSelected,
}) => {
  const styles = useStyles();
  const { uniqueId, name, title } = item;
  const text = title || name;
  return (
    <div className={styles.root}>
      <ListItem
        key={uniqueId}
        classes={{
          root: styles.breadcrumbItem,
        }}
        style={{ zIndex: zIndex }}
        button
        onClick={() => onDriveItemSelected(item)}
      >
        {!isFirst ? (
          <svg className={styles.svg} viewBox="0 0 88 100">
            <path d="M 0 0 L 88 50 L 0 100Z" />
          </svg>
        ) : null}
        <ListItemText classes={{ primary: styles.text }} primary={text} />
        <svg className={styles.svg} viewBox="0 0 88 100">
          <path d="M 0 0 L 88 0 L 88 100 L 0 100 L 88 50Z" />
        </svg>
      </ListItem>
    </div>
  );
};

export default BreadcrumbItem;
