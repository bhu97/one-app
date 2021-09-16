import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { getAssetPath } from '../../../helpers';
import { LoadingDialog } from '../../atoms';
import { Breadcrumbs } from '../../molecules';
import { StackedFileListController } from '../../ui/StackedFileListController';
import { useDriveItems } from './useDriveItems';

const useStyles = makeStyles((theme) => ({
  headers: {
    marginBottom: '38px',
  },
  main: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  image: {
    alignSelf: 'flex-end',
    maxHeight: '50vh',
  },
}));

export const HomePage: FC = () => {
  const styles = useStyles();
  const {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
  } = useDriveItems();

  return (
    <>
      <div className={styles.main}>
        <div>
          <div className={styles.headers}>
            <Typography variant="h1">Home</Typography>
            <Typography variant="h2">Please select your category</Typography>
          </div>
          <StackedFileListController
            items={items}
            onDriveItemSelected={onDriveItemSelected}
            currentRoute={currentRoute.slice(1)}
          />
        </div>
        {currentRoute.length === 1 ? (
          <img
            className={styles.image}
            src={getAssetPath(
              '../../../../../assets/home/200921_FMC_OneApp_Illustrationen_Final_Gruppe_02.png'
            )}
            alt=""
          />
        ) : null}
      </div>
      <Breadcrumbs
        items={currentRoute}
        onDriveItemSelected={onBreadcrumbItemSelected}
      />
      <LoadingDialog open={isLoading} />
    </>
  );
};

export default HomePage;
