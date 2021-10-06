import { Box, CircularProgress, Dialog, DialogContentText, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';

const useStyles = makeStyles(() => ({
  marginAutoContainer: {
    width: 500,
    height: 80,
    display: 'flex',
    backgroundColor: 'gold',
  },
  marginAutoItem: {
    margin: 'auto',
  },
  alignItemsAndJustifyContent: {
    width: 500,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
}));

interface ILoadingDialogProps {
  open: boolean;
  message?: string;
}

export const LoadingDialog: FC<ILoadingDialogProps> = ({ open, message }) => {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{message || 'Loading'}</DialogTitle>
      <Box className={classes.marginAutoItem}>
        <CircularProgress />
      </Box>
      <DialogContentText align="center">Please wait...</DialogContentText>
    </Dialog>
  );
};

export default LoadingDialog;
