import React, { FC, useEffect, useState } from 'react';

import { IDriveItem } from '../../../database/database';
import { FlexLightStoreFactory } from '../../../database/stores/FlexLightStoreFactory';
import { FileCommands } from '../../../enums';
import { useGetFilesData } from '../../../helpers';
import { FileList, LinkedItems } from '../../molecules';
import { PageStructure } from '../../templates';

interface IDocumentSetProps {
  documentSet: IDriveItem;
  onLinkedDocumentSetSelected: (documentSet: IDriveItem) => void;
}

export const DocumentSet: FC<IDocumentSetProps> = ({
  documentSet,
  onLinkedDocumentSetSelected,
}) => {
  const { items, thumbnails } = useGetFilesData(
    FlexLightStoreFactory.getStoreForCurrentUser({
      query: documentSet.uniqueId,
    }),
    documentSet.uniqueId
  );
  return (
    <PageStructure
      headerTitle={documentSet.title}
      headerDescription={documentSet.name /* TODO missing prop */}
      main={
        <FileList
          items={items}
          thumbnails={thumbnails}
          availableCommands={[
            FileCommands.AddToShoppingCart,
            FileCommands.AddRemoveFavourite,
          ]}
        />
      }
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
