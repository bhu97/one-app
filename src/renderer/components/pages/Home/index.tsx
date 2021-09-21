import { makeStyles } from '@material-ui/core';
import React, { FC, useRef } from 'react';

import { DriveItemType, IDriveItem } from '../../../../database/database';
import { BackButton, LoadingDialog } from '../../atoms';
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
    flexGrow: 1,
  },
}));

interface IHomePageProps {
  initialRoute: IDriveItem[];
  onRouteChanged: (currentRoute: IDriveItem[]) => void;
}

export const HomePage: FC = ({ initialRoute, onRouteChanged }) => {
  const styles = useStyles();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
  } = useDriveItems(mainRef, initialRoute, onRouteChanged);
  const lastItem = currentRoute[currentRoute.length - 1];

  return (
    <>
      <BackButton
        isHidden={currentRoute.length < 2}
        onClick={() =>
          onDriveItemSelected(
            currentRoute[currentRoute.length - 2],
            currentRoute.length - 2,
            true
          )
        }
      />
      <div ref={mainRef} className={styles.main}>
        {lastItem?.type === DriveItemType.DOCUMENTSET ? (
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
