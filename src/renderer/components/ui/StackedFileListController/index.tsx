import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useEffect, useState } from 'react';

import { IDriveItem } from '../../../../database/database';
import { FileList } from '../../molecules';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // width: '100%',
      // maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    fl: {
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
    <div className={classes.fl}>
      {items.map((columnItems, index) => {
        return (
          <FileList
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
