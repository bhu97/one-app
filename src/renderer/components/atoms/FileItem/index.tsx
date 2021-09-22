import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC, useState } from 'react';

import { IDriveItem } from '../../../../database/database';
import { dataManager } from '../../../DataManager';
import { getFileSizeLiteral, getIconByExtension } from '../../../helpers';
import { LoadingDialog } from '../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    padding: 0,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[300],
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '150px',
    backgroundColor: theme.palette.grey[900],
    '& svg': {
      transform: 'scale(2)',
    },
  },
  description: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderLeftWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    '&.downloaded': {
      borderColor: theme.palette.primary.main,
    },
    '&.outdated': {
      borderColor: theme.palette.error.main,
    },
  },
  text: {},
  rightWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  fileSize: {
    fontSize: '8px',
  },
}));

export interface IFileItemProps {
  item: IDriveItem;
  thumbnailUrl: string | undefined;
}

export const FileItem: FC<IFileItemProps> = ({ item, thumbnailUrl }) => {
  const styles = useStyles();
  const { uniqueId, name, title, fileExtension, fileSize } = item;
  const [isLoading, setIsLoading] = useState(false);
  const openFile = async () => {
    setIsLoading(true);
    await dataManager.openDriveItem(uniqueId);
    setIsLoading(false);
  };
  const text = title || name;
  return (
    <ListItem
      key={uniqueId}
      classes={{
        root: styles.root,
      }}
      button
    >
      <div
        onClick={openFile}
        className={styles.image}
        style={{
          backgroundImage: `url(${thumbnailUrl})`,
        }}
      >
        {getIconByExtension(fileExtension)}
      </div>
      <div className={styles.description}>
        <ListItemText
          primary={text}
          classes={{
            primary: styles.text,
          }}
        />
        <div className={styles.rightWrapper}>
          <div />
          {fileSize ? (
            <div className={styles.fileSize}>
              {getFileSizeLiteral(fileSize)}
            </div>
          ) : null}
        </div>
      </div>
      <LoadingDialog open={isLoading} />
    </ListItem>
  );
};

export default FileItem;
