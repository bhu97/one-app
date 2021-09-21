import { makeStyles } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { IDriveItem, Thumbnail } from '../../../../database/database';
import { FlexLightStoreFactory } from '../../../../database/stores/FlexLightStoreFactory';
import { dataManager } from '../../../DataManager';
import { PageHeader } from '../../atoms';
import { FileList } from '../../molecules';
import { thumbnailsMock } from './thumbnailsMock';

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
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  const getData = async () => {
    const store = await FlexLightStoreFactory.getStoreForCurrentUser({
      query: documentSet.uniqueId,
    });
    if (!store) return;
    await store.update();
    setItems(store.items);
    let newThumbnails: Thumbnail[];
    try {
      newThumbnails = await dataManager.getThumbnails(documentSet.uniqueId);
    } catch (e) {
      newThumbnails = thumbnailsMock;
    }
    setThumbnails(newThumbnails);
  };
  useEffect(() => {
    getData();
  }, [documentSet]);
  return (
    <div className={styles.root}>
      <PageHeader title={documentSet.title} description={documentSet.name} />
      <div className={styles.wrapper}>
        <FileList items={items} thumbnails={thumbnails} />
      </div>
    </div>
  );
};

export default DocumentSet;
