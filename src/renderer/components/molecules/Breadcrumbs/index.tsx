import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'database/database';
import React, { FC } from 'react';

import { BreadcrumbItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'sticky',
      bottom: 0,
      left: 0,
    },
    list: {
      display: 'flex',
      padding: theme.spacing(0, 1, 0, 1),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
    },
    listItemText: {
      whiteSpace: 'nowrap',
    },
  })
);

interface IBreadcrumbsProps {
  items: IDriveItem[];
  onDriveItemSelected: (item: IDriveItem, index: number) => void;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({
  items,
  onDriveItemSelected,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {items.map((item, index) => (
          <BreadcrumbItem
            key={item.uniqueId}
            item={item}
            isFirst={index === 0}
            zIndex={items.length - index}
            onDriveItemSelected={(driveItem) =>
              onDriveItemSelected(driveItem, index)
            }
          />
        ))}
      </List>
    </div>
  );
};

export default Breadcrumbs;
