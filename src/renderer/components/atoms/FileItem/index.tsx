import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { IDriveItem } from '../../../../database/database';
import { getFileSizeLiteral, getIconByExtension } from '../../../helpers';

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
}

export const FileItem: FC<IFileItemProps> = ({ item }) => {
  const styles = useStyles();
  const { uniqueId, name, title, webUrl, fileExtension, fileSize } = item;
  const text = title || name;
  return (
    <ListItem
      key={uniqueId}
      classes={{
        root: styles.root,
      }}
      component={Link}
      to={webUrl} // TODO correct param?
      button
    >
      <div
        className={styles.image}
        // style={{
        //   backgroundImage: item. // TODO preview?
        // }}
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
          <div className={styles.fileSize}>{getFileSizeLiteral(fileSize)}</div>
        </div>
      </div>
    </ListItem>
  );
};

export default FileItem;
