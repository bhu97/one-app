import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import illustration from '../../../../../assets/home/200921_FMC_OneApp_Illustrationen_Final_Gruppe_02.png';
import { IDriveItem } from '../../../database/database';
import { EmptyBoxIcon } from '../../../svg';
import { StackedFileListController } from '../StackedFileListController';

const useStyles = makeStyles((theme) => ({
  image: {
    alignSelf: 'flex-end',
    maxHeight: '50vh',
    position: 'sticky',
    bottom: '100px',
  },
  emptyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    color: theme.palette.grey[700],
    fontWeight: 500,
    textAlign: 'center',
    '& svg': {
      maxWidth: '200px',
    },
  },
  email: {
    margin: 0,
    color: 'inherit',
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
      {items[0] && items[0].length ? (
        <div>
          <StackedFileListController
            items={items}
            onDriveItemSelected={onDriveItemSelected}
            currentRoute={currentRoute.slice(1)}
          />
        </div>
      ) : (
        <div className={styles.emptyWrapper}>
          <EmptyBoxIcon />
          <div>
            There are no files here yet
            <br /> You might not have sufficient permissions.
            <br />
            Please contact{' '}
            <a className={styles.email} href="mailto:oneapp@gmc-ag.com">
              oneapp@gmc-ag.com
            </a>
          </div>
        </div>
      )}
      {currentRoute.length === 1 ? (
        <img className={styles.image} src={illustration} alt="" />
      ) : null}
    </>
  );
};

export default FolderList;
