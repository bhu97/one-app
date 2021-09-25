import { List, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';
import { IDriveItem, Thumbnail } from 'renderer/database/database';

import emptyThumbnail from '../../../../../assets/content-page/empty_thumbnail.png';
import { FileItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2, 4),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
    },
    wrapper: {
      display: 'grid',
      gridGap: theme.spacing(2),
      gridTemplateColumns: '1fr 1fr',
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '1fr 1fr 1fr',
      },
    },
    title: {
      marginBottom: theme.spacing(2),
    },
  })
);

interface IFileListProps {
  title?: string;
  items: IDriveItem[];
  thumbnails: Thumbnail[];
}

export const FileList: FC<IFileListProps> = ({ items, thumbnails, title }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {title ? (
        <Typography variant="h2" classes={{ h2: styles.title }}>
          {title}
        </Typography>
      ) : undefined}
      <List className={styles.wrapper}>
        {items.map((item) => {
          const isArchive = item.fileExtension === 'zip';
          const isNew = item.timeLastModified
            ? (new Date().valueOf() -
                new Date(item.timeLastModified).valueOf()) /
                1000 /
                60 /
                60 /
                24 <
              28
            : false;
          const thumbnail = thumbnails.find(
            (elem) => elem.uniqueId === item.uniqueId
          );
          let thumbnailUrl: string | undefined;
          if (isArchive) {
            thumbnailUrl = emptyThumbnail;
          } else if (thumbnail && thumbnail.largeUrl) {
            thumbnailUrl = thumbnail.largeUrl;
          }
          return (
            <FileItem
              key={item.uniqueId}
              hasOverlay
              item={item}
              thumbnailUrl={thumbnailUrl}
              isNew={isNew}
            />
          );
        })}
      </List>
    </div>
  );
};

export default FileList;
