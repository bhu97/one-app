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
    async function getData() {
      let items = await db.rootItemsForCountry("DEU") ?? []
      console.log("items: "+items);
      
      setState({items: [...state.items, items]})
    }
    getData()
  }, [])

  var items:Array<Array<IDriveItem>> = [];
  const addColumn = () => {
    let array = [
      makeid(5),
      makeid(5),
      makeid(5),
      makeid(5),
      makeid(5),
      makeid(5)
    ];
    //items = [...items, array];
    //setState({ items: [...state.items, array] });
    console.log(state.items);
  };

  const [state, setState] = useState({ items: items });

  const classes = useStyles();

  const selectedItem = (item: string) => {
    addColumn();
    //props.update();
  };

  return (
    <div className={classes.fl}>
      <Typography>FileListController</Typography>
      {state.items.map((items) => {
        return <FileList items={items} selectedItem={selectedItem}></FileList>
      })}
    </div>
  );
};

function makeid(length:number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default StackedFileListController;