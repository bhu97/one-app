import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useEffect, useState } from 'react';

import { db, IDriveItem } from '../../../../database/database';
import FileList from '../FileList';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // width: '100%',
      // maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    fl: {
      display: 'flex',
      width: '100%',
    },
  })
);

export const StackedFileListController: FC = () => {
  const [state, setState] = useState({ items: Array<Array<IDriveItem>>() });

  const getRootData = async () => {
    const items = (await db.rootItemsForCountry('master')) ?? [];

    setState({ items: [...state.items, items] });
  };

  useEffect(() => {
    getRootData();
  }, []);

  // get the first level data
  // this happens by country code
  // TODO: change country code to dynamic value

  // get all drive items for a parent unique id
  const getFileListData = async (uniqueId: string) => {
    const items = (await db.allItems(uniqueId)) ?? [];
    setState({ items: [...state.items, items] });
  };

  const addColumn = async (uniqueId: string) => {
    await getFileListData(uniqueId);
  };

  const popColumn = (uniqueId: string, index: number) => {
    setState({
      items: [...state.items.slice(0, index + 1)],
    });
  };

  const classes = useStyles();

  const selectedItem = (item: string, index: number) => {
    if (index >= state.items.length - 1) {
      addColumn(item);
    } else {
      popColumn(item, index);
      // TODO: fix this bug
      // addColumn(item);
    }
  };

  return (
    <div className={classes.fl}>
      {state.items.map((items, index) => {
        return (
          <FileList
            key={index}
            items={items}
            selectedItem={selectedItem}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default StackedFileListController;
