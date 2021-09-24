import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC, useState } from 'react';

import { DriveItemType, IDriveItem } from '../../../database/database';
import { dataManager } from '../../../DataManager';
import { LinkIcon } from '../../../svg';
import { LoadingDialog } from '../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '68px',
    padding: theme.spacing(1, 2),
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[300],
  },
  text: {},
  icon: {
    display: 'flex',
    width: '28px',
    height: '28px',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    background: theme.palette.background.paper,
  },
}));

interface ILinkedItemProps {
  driveItem: IDriveItem;
  onLinkedDocumentSetSelected: (documentSet: IDriveItem) => void;
}

export const LinkedItem: FC<ILinkedItemProps> = ({
  driveItem,
  onLinkedDocumentSetSelected,
}) => {
  const { uniqueId, name, title, contentType, type } = driveItem;
  const styles = useStyles();
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
    <ListItem
      key={uniqueId}
      classes={{
        root: styles.root,
      }}
      onClick={openFile}
      button
    >
      <div className={styles.icon}>{LinkIcon}</div>
      <ListItemText
        primary={text}
        classes={{
          primary: styles.text,
        }}
      />
      <LoadingDialog open={isLoading} />
    </ListItem>
  );
};

export default LinkedItem;
