import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem } from 'renderer/database/database';
import React, { FC, useEffect, useRef, useState } from 'react';

import { BreadcrumbItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'sticky',
      bottom: 0,
      left: 0,
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
  const [minWidth, setMinWidth] = useState('0px');
  const rootRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    if (!rootRef.current) return;
    let width = 0;
    rootRef.current.children.forEach((child: HTMLUListElement) => {
      width += child.offsetWidth;
    });
    const newWidth = `${width}px`;
    if (minWidth !== newWidth) {
      setMinWidth(newWidth);
    }
  });

  return (
    <List
      ref={rootRef}
      className={classes.root}
      style={{
        minWidth,
      }}
    >
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
  );
};

export default Breadcrumbs;
