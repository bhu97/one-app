import React, { FC, useState } from 'react';

import { DriveItemType, IDriveItem } from '../../../database/database';
import { dataManager } from '../../../DataManager';
import { LinkIcon } from '../../../svg';
import { RightMenuItem } from '../RightMenuItem';

interface ILinkedItemProps {
  driveItem: IDriveItem;
  onLinkedDocumentSetSelected: (documentSet: IDriveItem) => void;
}

export const LinkedItem: FC<ILinkedItemProps> = ({
  driveItem,
  onLinkedDocumentSetSelected,
}) => {
  const { uniqueId, name, title } = driveItem;
  const [isLoading, setIsLoading] = useState(false);
  const openFile = async () => {
    setIsLoading(true);
    const isDocumentSet =
      driveItem.contentType === 'Document Set' || // TODO type and isDocumentSet are not working
      driveItem?.type === DriveItemType.DOCUMENTSET;
    if (isDocumentSet) {
      onLinkedDocumentSetSelected(driveItem);
    } else {
      await dataManager.openDriveItem(uniqueId);
    }
    setIsLoading(false);
  };
  const text = title || name;
  return (
    <RightMenuItem
      key={uniqueId}
      text={text}
      icon={LinkIcon}
      onClick={openFile}
      isLoading={isLoading}
    />
  );
};

export default LinkedItem;
