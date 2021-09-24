import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';

import { IDriveItem } from '../../../database/database';
import { FolderList } from '../../molecules';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
    },
  })
);

interface IStackedFileListControllerProps {
  items: IDriveItem[][];
  currentRoute: IDriveItem[];
  onDriveItemSelected: (item: IDriveItem, level: number) => void;
}

export const StackedFileListController: FC<IStackedFileListControllerProps> = ({
  items,
  currentRoute,
  onDriveItemSelected,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {items.map((columnItems, index) => {
        return (
          <FolderList
            key={index}
            items={columnItems}
            selectedItem={currentRoute[index]}
            onDriveItemSelected={(item) => onDriveItemSelected(item, index)}
          />
        );
      })}
    </div>
  );
};

export default StackedFileListController;
