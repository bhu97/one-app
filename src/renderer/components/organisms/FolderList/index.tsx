import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import illustration from '../../../../../assets/home/200921_FMC_OneApp_Illustrationen_Final_Gruppe_02.png';
import { IDriveItem } from '../../../database/database';
import { StackedFileListController } from '../StackedFileListController';

const useStyles = makeStyles((theme) => ({
  image: {
    alignSelf: 'flex-end',
    maxHeight: '50vh',
    position: 'sticky',
    bottom: '100px',
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
  return (
    <>
      <div>
        <StackedFileListController
          items={items}
          onDriveItemSelected={onDriveItemSelected}
          currentRoute={currentRoute.slice(1)}
        />
      </div>
      {currentRoute.length === 1 ? (
        <img className={styles.image} src={illustration} alt="" />
      ) : null}
    </>
  );
};

export default FolderList;
