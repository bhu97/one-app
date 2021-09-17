import { makeStyles } from '@material-ui/core';
import React, { FC, useRef } from 'react';

import { DriveItemType } from '../../../../database/database';
import { LoadingDialog } from '../../atoms';
import { Breadcrumbs } from '../../molecules';
import { FolderList } from '../../organisms';
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
  const mainRef = useRef<HTMLDivElement | null>(null);
  const {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
  } = useDriveItems(mainRef);

  const lastItemType = currentRoute[currentRoute.length - 1].type;

  return (
    <>
      <div ref={mainRef} className={styles.main}>
        {lastItemType === DriveItemType.DOCUMENTSET ? (
          <div>SHOW DOCUMENT SET</div>
        ) : (
          <FolderList
            items={items}
            currentRoute={currentRoute}
            onDriveItemSelected={onDriveItemSelected}
          />
        )}
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
