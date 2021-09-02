import React, { Fragment, useState, FC, FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { Button, List } from "@material-ui/core";
import {
  ListItem,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import { IDriveItem } from "database/database";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    },
  })
);

type FileListProps = {
  items: Array<IDriveItem>,
  selectedItem: (id:string) => void
}

const FileList: FC <FileListProps> = ({items, selectedItem}) => {
  const classes = useStyles();

  const pressedItem = (id:string) => {
    selectedItem(id);
  };

  return (
    <List className={classes.root}>
      {items.map((item) => {
        return (
          <Fragment>
            <ListItem
              key={item.uniqueId}
              button
              onClick={() => {
                pressedItem(item.uniqueId);
              }}
            >
              <ListItemText primary={item} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  &gt;
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </Fragment>
        );
      })}
    </List>
  );
};

export default FileList;