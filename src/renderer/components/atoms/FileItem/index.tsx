import { Button, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { toast } from 'material-react-toastify';
import React, { FC, useState } from 'react';

import { IDriveItem } from '../../../database/database';
import { cartStore } from '../../../database/stores/CartStore';
import { dataManager } from '../../../DataManager';
import { FileCommands } from '../../../enums';
import { getFileSizeLiteral, getIconByExtension } from '../../../helpers';
import { NewArrowIcon } from '../../../svg';
import { DropdownMenu } from '../DropdownMenu';
import { LoadingDialog } from '../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    padding: 0,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[300],
  },
  image: {
    position: 'relative',
    width: '100%',
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
    '&:hover': {
      transform: 'unset',
    },
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    alignItems: 'flex-end',
  },
  fileSize: {
    fontSize: '8px',
  },
  arrow: {
    fill: theme.palette.info.main,
    flexBasis: '24px',
    display: 'flex',
    marginRight: '10px',
  },
}));

export interface IFileItemProps {
  item: IDriveItem;
  thumbnailUrl: string | undefined;
  hasOverlay: boolean;
  isNew: boolean;
  availableCommands: FileCommands[];
  onCartChange: () => void;
  onFavouriteChange: () => void;
}

export const FileItem: FC<IFileItemProps> = ({
  item,
  availableCommands,
  thumbnailUrl,
  hasOverlay,
  isNew,
  onCartChange,
  onFavouriteChange,
}) => {
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
    >
      <Button
        onClick={openFile}
        className={styles.image}
        style={{
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
        }}
      >
        {hasOverlay ? <div className={styles.overlay} /> : undefined}
        {getIconByExtension(fileExtension)}
      </Button>
      <div className={styles.description}>
        {isNew ? <div className={styles.arrow}>{NewArrowIcon}</div> : undefined}
        <ListItemText
          primary={text}
          classes={{
            primary: styles.text,
          }}
        />
        <div className={styles.rightWrapper}>
          <DropdownMenu
            commands={[
              {
                title: FileCommands.AddToShoppingCart,
                onClick: async () => {
                  setIsLoading(true);
                  try {
                    await cartStore.addDriveItem(item.uniqueId);
                    await cartStore.update();
                    if (onCartChange) onCartChange();
                    toast.success(`${text} has been added to cart`);
                  } catch (e) {
                    toast.error(`${text} couldn't be added to cart`);
                  }
                  setIsLoading(false);
                },
              },
              {
                title: FileCommands.RemoveFromShoppingCart,
                onClick: async () => {
                  setIsLoading(true);
                  try {
                    await cartStore.removeDriveItem(item.uniqueId);
                    await cartStore.update();
                    if (onCartChange) onCartChange();
                    toast.success(`${text} has been removed from cart`);
                  } catch (e) {
                    toast.error(`${text} couldn't be removed from cart`);
                  }
                  setIsLoading(false);
                },
              },
              {
                title: FileCommands.AddRemoveFavourite,
                onClick: console.log, // TODO
              },
            ].filter((command) =>
              availableCommands.some(
                (availableCommand) => availableCommand === command.title
              )
            )}
          />
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
