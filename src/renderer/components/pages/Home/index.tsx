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
  sticky: {
    position: 'sticky',
    left: 0,
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
    onLinkedDocumentSetSelected,
    onBackButtonClicked,
  } = useDriveItems(mainRef, initialRoute, onRouteChanged);
  const lastItem = currentRoute[currentRoute.length - 1];
  const lastItemName =
    currentRoute[currentRoute.length - 1].title ||
    currentRoute[currentRoute.length - 1].name;

  const isDocumentSet =
    lastItem.contentType === 'Document Set' || // TODO type and isDocumentSet are not working
    lastItem?.type === DriveItemType.DOCUMENTSET;
  return (
    <>
      <BackButton
        isHidden={currentRoute.length < 2}
        onClick={onBackButtonClicked}
      />
      {isDocumentSet ? null : (
        <div className={styles.headers}>
          <Typography variant="h1">{lastItemName}</Typography>
          <Typography variant="h2">Please select your category</Typography>
        </div>
      )}
      <div
        ref={mainRef}
        className={`${styles.main} ${isDocumentSet ? styles.sticky : ''}`}
      >
        {isDocumentSet ? (
          <DocumentSet
            documentSet={lastItem}
            onLinkedDocumentSetSelected={onLinkedDocumentSetSelected}
          />
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
