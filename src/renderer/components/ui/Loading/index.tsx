import { CircularProgress, Dialog, DialogContentText, DialogTitle, Typography } from "@material-ui/core";
import React, {FC} from "react";

import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  marginAutoContainer: {
    width: 500,
    height: 80,
    display: 'flex',
    backgroundColor: 'gold',
  },
  marginAutoItem: {
    margin: 'auto'
  },
  alignItemsAndJustifyContent: {
    width: 500,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
}))

type LoadingDialogProps = {
  open: boolean
}

export const LoadingDialog:FC<LoadingDialogProps> = (props:LoadingDialogProps) => {
  const { open } = props;
  const classes = useStyles()

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title" >Loading metadata</DialogTitle>
      <Box className={classes.marginAutoItem}>
        <CircularProgress />
      </Box>
      <DialogContentText align="center">Please wait...</DialogContentText>
    </Dialog>
  );
}