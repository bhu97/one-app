import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import React, { FC, useEffect } from 'react';

import { useFavourites } from '../../../helpers';

const useStyles = makeStyles((theme) => ({
  checkbox: {
    color: `${theme.palette.primary.main} !important`,
  },
}));

export interface IFavsModalProps {
  uniqueId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FavsModal: FC<IFavsModalProps> = ({
  uniqueId,
  isOpen,
  onClose,
}) => {
  const styles = useStyles();
  const {
    favoriteGroups,
    getSelectedFavoriteGroups,
    selectedFavoriteGroups,
    selectFavouriteGroupForItem,
  } = useFavourites();
  useEffect(() => {
    if (isOpen) {
      getSelectedFavoriteGroups(uniqueId);
    }
  }, [isOpen]);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">Add to Favourites</DialogTitle>
      <DialogContent>
        {favoriteGroups.map((fav) => (
          <FormControlLabel
            key={fav.id}
            style={{
              display: 'block',
            }}
            control={
              <Checkbox
                classes={{
                  colorSecondary: styles.checkbox,
                }}
                onChange={(event) =>
                  selectFavouriteGroupForItem(
                    uniqueId,
                    fav.name,
                    event.target.checked
                  )
                }
                checked={selectedFavoriteGroups.some(
                  (name) => name === fav.name
                )}
              />
            }
            label={fav.name}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavsModal;
