import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({}));

export interface IUpdateMetadataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

export const UpdateMetadataDialog: FC<IUpdateMetadataDialogProps> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  const styles = useStyles();
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">Updates available</DialogTitle>
      <DialogContent>Would you like to update and download?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" variant="contained" onClick={onUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMetadataDialog;
