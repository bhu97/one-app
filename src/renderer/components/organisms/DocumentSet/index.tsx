import { makeStyles } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { IDriveItem, Thumbnail } from '../../../database/database';
import { FlexLightStoreFactory } from '../../../database/stores/FlexLightStoreFactory';
import { dataManager } from '../../../DataManager';
import { FileList, LinkedItems } from '../../molecules';
import { PageStructure } from '../../templates';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

interface IDocumentSetProps {
  documentSet: IDriveItem;
  onLinkedDocumentSetSelected: (documentSet: IDriveItem) => void;
}

export const DocumentSet: FC<IDocumentSetProps> = ({
  documentSet,
  onLinkedDocumentSetSelected,
}) => {
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
      newThumbnails = [];
    }
    setThumbnails(newThumbnails);
  };
  useEffect(() => {
    getData();
  }, [documentSet]);
  return (
    <PageStructure
      headerTitle={documentSet.title}
      headerDescription={documentSet.name /* TODO missing prop */}
      main={<FileList items={items} thumbnails={thumbnails} />}
      column={
        <LinkedItems
          documentSet={documentSet}
          onLinkedDocumentSetSelected={onLinkedDocumentSetSelected}
        />
      }
    />
  );
};

export default DocumentSet;
