import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useEffect, useState } from 'react';
import { IDriveItem } from 'renderer/database/database';

import { LinkedStore } from '../../../database/stores/LinkedStore';
import { LinkedItem, RightMenuBox } from '../../atoms';

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
  onLinkedDocumentSetSelected: (documentSet: IDriveItem) => void;
}

export const LinkedItems: FC<ILinkedItemsProps> = ({
  documentSet,
  onLinkedDocumentSetSelected,
}) => {
  const classes = useStyles();
  const [items, setItems] = useState<IDriveItem[]>([]);
  const getData = async () => {
    const store = new LinkedStore({
      query: documentSet.uniqueId,
    });
    if (!store) return;
    await store.update();
    setItems(store.items);
  };
  useEffect(() => {
    getData();
  }, [documentSet]);

  return (
    <RightMenuBox title="More information">
      <List>
        {items.map((item) => (
          <LinkedItem
            key={item.uniqueId}
            driveItem={item}
            onLinkedDocumentSetSelected={onLinkedDocumentSetSelected}
          />
        ))}
      </List>
    </RightMenuBox>
  );
};

export default LinkedItems;
