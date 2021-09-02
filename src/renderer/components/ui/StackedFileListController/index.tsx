import React, { Fragment, useState, FC, useEffect } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import {db, DriveItem, IDriveItem} from './../../../../database/database'
import Typography from "@material-ui/core/Typography";
import FileList from "./../FileList"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      //width: '100%',
      //maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: "inline"
    },
    fl: {
      display: "flex",
      width: "100%"
    }
  })
);
type StackedFileListControllerProps = {

}
const StackedFileListController:FC<StackedFileListControllerProps> = () => {
  useEffect(() => {
    getRootData()
  }, [])

  //get the first level data
  //this happens by country code
  //TODO: change country code to dynamic value
  const getRootData = async() => {
    let items = await db.rootItemsForCountry("DEU") ?? []     
    setState({items: [...state.items, items]})
  }

  //get all drive items for a parent unique id
  const getFileListData = async (uniqueId: string) => {
    let items = await db.allItems(uniqueId) ?? []
    setState({items: [...state.items, items]})
  }

  const addColumn = async (uniqueId: string) => {
    await getFileListData(uniqueId)
  };

  const popColumn = (uniqueId: string, index: number) => {
    console.log("pop column to index "+ state.items.length)
    setState({ 
      items: [...state.items.slice(0,index+1)]
    });
    console.log([...state.items.slice(0,index+1)]);
  };

  const [state, setState] = useState({ items: Array<Array<IDriveItem>>() });

  const classes = useStyles();

  const selectedItem = (item: string, index: number) => {
    if (index >= state.items.length-1) {
      addColumn(item);
    } else {
      popColumn(item, index);
      //TODO: fix this bug
      //addColumn(item);
    }
  };

  return (
    <div className={classes.fl}>
      {state.items.map((items, index) => {
        return <FileList key={index} items={items} selectedItem={selectedItem} index={index}></FileList>
      })}
    </div>
  );
};

export default StackedFileListController;