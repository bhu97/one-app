import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { FC, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  checkbox: {
    color: `${theme.palette.primary.main} !important`,
  },
}));

export interface IFavsCategoryDialogProps {
  isDialogLoading: boolean;
  initialText: string | undefined;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (text: string) => void;
}

export const FavsCategoryDialog: FC<IFavsCategoryDialogProps> = ({
  isDialogLoading,
  initialText,
  isOpen,
  title,
  onClose,
  onSave,
}) => {
  const styles = useStyles();
  const [text, setText] = useState(initialText || '');
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField
          label=""
          defaultValue={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          disabled={isDialogLoading || text.trim().length === 0}
          variant="contained"
          onClick={() => onSave(text)}
        >
          {isDialogLoading ? <CircularProgress /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavsCategoryDialog;
