import { makeStyles } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { IDriveItem } from '../../../../database/database';
import { FlexLightStoreFactory } from '../../../../database/stores/FlexLightStoreFactory';
import { dataManager } from '../../../DataManager';
import { PageHeader } from '../../atoms';
import { FileList } from '../../molecules';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    marginBottom: theme.spacing(11),
  },
}));

interface IDocumentSetProps {
  documentSet: IDriveItem;
}

export const DocumentSet: FC<IDocumentSetProps> = ({ documentSet }) => {
  const styles = useStyles();
  const [items, setItems] = useState<IDriveItem[]>([]);

  const getData = async () => {
    const store = await FlexLightStoreFactory.getStoreForCurrentUser({
      query: documentSet.uniqueId,
    });
    if (!store) return;
    await store.update();
    setItems(store.items);
    try {
      const thumbnails = await Promise.all(
        store.items.map((item) => dataManager.getThumbnails(item.uniqueId))
      );
      console.log(thumbnails);
    } catch (e) {
      console.error('No thumbnails for you');
    }
  };
  useEffect(() => {
    getData();
  }, [documentSet]);
  return (
    <div className={styles.root}>
      <PageHeader title={documentSet.title} description={documentSet.name} />
      <div className={styles.wrapper}>
        <FileList items={items} />
      </div>
    </div>
  );
};

export default DocumentSet;
