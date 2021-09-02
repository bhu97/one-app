import { Box, Container, Typography } from '@material-ui/core';
import { Title } from '@material-ui/icons';
import React, { Fragment } from 'react';
import Sidebar from 'renderer/components/ui/Sidebar';
import {db} from './../../database/database'

import { responseToDriveItem, responseToListItem } from 'utils/object.mapping';
import { LoadingDialog } from 'renderer/components/ui/Loading';
import StackedFileListController from 'renderer/components/ui/StackedFileListController';

type HomePageProps = {
 
}

type HomePageState = {
  isLoading: boolean
}

export class HomePage extends React.Component<HomePageProps, HomePageState>{
  
  constructor(props:any) {
    super(props);
    this.state = {isLoading: false};
  }
  
  componentDidMount() {
    this.setupDummyData()
  }

  render() {
    return (
      <Fragment>
      <main>
        <Sidebar navigationEnabled={true}>
        <Typography>Hallo</Typography>
          
        </Sidebar>
        
        
      </main>
       <LoadingDialog open={this.state.isLoading}></LoadingDialog>
      </Fragment>
    );
  }
  async setupDummyData() {
    
    if(await db.isEmpty()) {
      this.setState({...this.state, isLoading: true})

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

      this.setState({...this.state, isLoading: false})
    }
  }
}

