import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';
import { IDriveItem, Thumbnail } from 'renderer/database/database';

import { getAssetPath } from '../../../helpers';
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
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(2),
    },
  })
);

interface IFileListProps {
  items: IDriveItem[];
  thumbnails: Thumbnail[];
}

export const FileList: FC<IFileListProps> = ({ items, thumbnails }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.wrapper}>
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
            thumbnailUrl = getAssetPath(
              '../../../../../assets/content-page/empty_thumbnail.png'
            ); // TODO test if working for PROD
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
