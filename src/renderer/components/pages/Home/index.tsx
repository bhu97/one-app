import { makeStyles, Typography } from '@material-ui/core';
import React, { FC, useRef } from 'react';

import { DriveItemType, IDriveItem } from '../../../../database/database';
import { BackButton, LoadingDialog } from '../../atoms';
import { Breadcrumbs } from '../../molecules';
import { DocumentSet, FolderList } from '../../organisms';
import { useDriveItems } from './useDriveItems';

const useStyles = makeStyles((theme) => ({
  headers: {
    position: 'sticky',
    left: 0,
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

export const HomePage: FC<IHomePageProps> = ({
  initialRoute,
  onRouteChanged,
}) => {
  const styles = useStyles();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const {
    isLoading,
    items,
    currentRoute,
    onDriveItemSelected,
    onBreadcrumbItemSelected,
    onBackButtonClicked,
  } = useDriveItems(mainRef, initialRoute, onRouteChanged);
  const lastItem = currentRoute[currentRoute.length - 1];
  const lastItemName =
    currentRoute[currentRoute.length - 1].title ||
    currentRoute[currentRoute.length - 1].name;

  return (
    <>
      <BackButton
        isHidden={currentRoute.length < 2}
        onClick={onBackButtonClicked}
      />
      <div className={styles.headers}>
        <Typography variant="h1">{lastItemName}</Typography>
        <Typography variant="h2">Please select your category</Typography>
      </div>
      <div ref={mainRef} className={styles.main}>
        {lastItem.contentType === 'Document Set' || // TODO type and isDocumentSet are not working
        lastItem?.type === DriveItemType.DOCUMENTSET ? (
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
