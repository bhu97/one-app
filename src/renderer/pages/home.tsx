import { Box, Container, makeStyles, Typography, withStyles } from '@material-ui/core';
import { CallMissedSharp, Title } from '@material-ui/icons';
import React, { FC, Fragment, useEffect, useState } from 'react';
import Sidebar from 'renderer/components/ui/Sidebar';
import {db} from './../../database/database'

import { responseToDriveItem, responseToListItem } from 'utils/object.mapping';
import { LoadingDialog } from 'renderer/components/ui/Loading';
import StackedFileListController from 'renderer/components/ui/StackedFileListController';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
  button: {
    marginRight: `${theme.spacing(2)} !important`,
  },
  longBuildDurationWarning: {
    marginBottom: theme.spacing(1),
  },
  buildResponse: {
    marginBottom: theme.spacing(1),
  },
  tooltip: {
    paddingLeft: '1em',
    paddingRight: '1em',
    fontSize: '1.4em !important',
    '& a': {
      color: '#90caf9',
    },
  },
}));

type HomePageProps = {
 
}

type HomePageState = {
  isLoading: boolean
}

const HomePage: FC<HomePageProps> = () => {
  
  useEffect(() => {
    //setupDummyData()
  }, [])
  const classes = useStyles();
  const [state, setState] = useState({isLoading: false})

  const setupDummyData = async() => {
    
    if(await db.isEmpty()) {
      setState({...state, isLoading: true})
  
      let deltaResponse = await fetch('./../../../assets/delta.json');  
      let deltaResponseJson = await deltaResponse.json();
      //console.log(deltaResponseJson.value[0]);
      let driveItems = deltaResponseJson.value.map(responseToDriveItem);
      await db.save(driveItems);
  
      let listitemResponse = await fetch('./../../../assets/listitem.json');
      let listitemResponseJson = await listitemResponse.json();
      console.log(listitemResponseJson.value[0]);
      let listItems = listitemResponseJson.value.map(responseToListItem);
      await db.saveMetaData(listItems)
  
      setState({...state, isLoading: false})
    }
  }
    return (
      <Fragment>
      <main className={classes.root}>
        <Sidebar navigationEnabled={true}>
          <Typography>Hallo</Typography>  
        </Sidebar>
        <div className={classes.content}>
          <Container className={classes.main}>
            <StackedFileListController></StackedFileListController>
          </Container>
        </div>
      </main>
       <LoadingDialog open={state.isLoading}></LoadingDialog>
      </Fragment>
    );
}



export default HomePage;