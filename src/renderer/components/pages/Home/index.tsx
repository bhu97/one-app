import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { LoadingDialog } from '../../atoms';
import { StackedFileListController } from '../../ui/StackedFileListController';
import { useDriveItems } from './useDriveItems';

const useStyles = makeStyles((theme) => ({
  headers: {
    marginBottom: '38px',
  },
}));

export const HomePage: FC = () => {
  const styles = useStyles();
  const { isLoading, items, currentRoute, onDriveItemSelected } =
    useDriveItems();

  return (
    <>
      <div className={styles.headers}>
        <Typography variant="h1">Home</Typography>
        <Typography variant="h2">Please select your category</Typography>
      </div>
      <StackedFileListController
        items={items}
        onDriveItemSelected={onDriveItemSelected}
        currentRoute={currentRoute}
      />
      <LoadingDialog open={isLoading} />
    </>
  );
};

export default HomePage;
