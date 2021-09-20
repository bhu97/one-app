import { makeStyles } from '@material-ui/core';
import React, { FC, useRef } from 'react';

import { DriveItemType } from '../../../../database/database';
import { LoadingDialog } from '../../atoms';
import { Breadcrumbs } from '../../molecules';
import { DocumentSet, FolderList } from '../../organisms';
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
  const lastItem = currentRoute[currentRoute.length - 1];

  return (
    <>
      <div ref={mainRef} className={styles.main}>
        {lastItem.contentType === 'Document Set' ||
        lastItem?.type === DriveItemType.DOCUMENTSET ? ( // TODO BUG IN BACKEND ENUM
          <DocumentSet documentSet={lastItem} />
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
