import { makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { IDriveItem } from '../../../../database/database';
import { LoadingDialog } from '../../atoms/Loading';
import { StackedFileListController } from '../../ui/StackedFileListController';

const useStyles = makeStyles((theme) => ({
  headers: {
    marginBottom: '38px',
  },
}));

export const HomePage: FC = () => {
  useEffect(() => {
    // setupDummyData()
  }, []);
  const styles = useStyles();
  const [state, setState] = useState({ isLoading: false });
  const [currentRoute, setCurrentRoute] = useState<IDriveItem[]>([]);

  // const setupDummyData = async () => {
  //   if (await db.isEmpty()) {
  //     setState({ ...state, isLoading: true });

  //     let deltaResponse = await fetch('./../../../assets/delta.json');
  //     let deltaResponseJson = await deltaResponse.json();
  //     //console.log(deltaResponseJson.value[0]);
  //     let driveItems = deltaResponseJson.value.map(responseToDriveItem);
  //     await db.save(driveItems);

  //     let listitemResponse = await fetch('./../../../assets/listitem.json');
  //     let listitemResponseJson = await listitemResponse.json();
  //     console.log(listitemResponseJson.value[0]);
  //     let listItems = listitemResponseJson.value.map(responseToListItem);
  //     await db.saveMetaData(listItems);

  //     setState({ ...state, isLoading: false });
  //   }
  // };

  return (
    <>
      <div className={styles.headers}>
        <Typography variant="h1">Home</Typography>
        <Typography variant="h2">Please select your category</Typography>
      </div>
      <StackedFileListController />
      <LoadingDialog open={state.isLoading} />
    </>
  );
};

export default HomePage;
