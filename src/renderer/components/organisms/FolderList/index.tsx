import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { IDriveItem } from '../../../../database/database';
import { getAssetPath } from '../../../helpers';
import { BackButton } from '../../atoms';
import { StackedFileListController } from '../StackedFileListController';

const useStyles = makeStyles((theme) => ({
  headers: {
    marginBottom: '38px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    alignSelf: 'flex-end',
    maxHeight: '50vh',
  },
}));

interface IFolderListProps {
  items: IDriveItem[][];
  currentRoute: IDriveItem[];
  onDriveItemSelected: (
    item: IDriveItem,
    index: number,
    fromBreadcrumbs?: boolean
  ) => Promise<void>;
}

export const FolderList: FC<IFolderListProps> = ({
  items,
  currentRoute,
  onDriveItemSelected,
}) => {
  const styles = useStyles();
  const lastItemName =
    currentRoute[currentRoute.length - 1].title ||
    currentRoute[currentRoute.length - 1].name;

  return (
    <>
      <div>
        <div className={styles.headers}>
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
          <Typography variant="h1">{lastItemName}</Typography>
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
            '../../../../../assets/home/200921_FMC_OneApp_Illustrationen_Final_Gruppe_02.png' // TODO test if working for PROD
          )}
          alt=""
        />
      ) : null}
    </>
  );
};

export default FolderList;
