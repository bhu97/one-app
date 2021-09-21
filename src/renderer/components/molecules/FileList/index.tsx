import { List } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { IDriveItem, Thumbnail } from 'database/database';
import React, { FC } from 'react';

import { getAssetPath } from '../../../helpers';
import { FileItem } from '../../atoms';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(2),
      padding: theme.spacing(2, 4),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
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
    <List className={classes.root}>
      {items.map((item) => {
        const thumbnail = thumbnails.find((elem) => elem.id === item.uniqueId);
        const firstImage = thumbnail?.thumbnails[0];
        let thumbnailUrl: string | undefined;
        if (item.fileExtension === 'zip') {
          thumbnailUrl = getAssetPath(
            '../../../../../assets/content-page/empty_thumbnail.png'
          ); // TODO test if working for PROD);
        } else if (firstImage && firstImage.large?.url) {
          thumbnailUrl = firstImage.large.url;
        }
        return (
          <FileItem
            key={item.uniqueId}
            item={item}
            thumbnailUrl={thumbnailUrl}
          />
        );
      })}
    </List>
  );
};

export default FileList;
