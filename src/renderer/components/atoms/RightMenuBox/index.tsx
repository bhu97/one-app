import { IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';

import { PlusIcon } from '../../../svg';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexBasis: '300px',
      padding: theme.spacing(2, 4),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
    },
    titleWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      minWidth: theme.spacing(3),
      minHeight: theme.spacing(3),
      backgroundColor: theme.palette.grey[300],
      borderRadius: 0,
      padding: '4px',
    },
  })
);

interface IRightMenuBoxProps {
  title: string;
  isColumnOnLeft?: boolean;
  onPlusClick?: () => void;
}

export const RightMenuBox: FC<IRightMenuBoxProps> = ({
  title,
  children,
  isColumnOnLeft,
  onPlusClick,
}) => {
  const styles = useStyles();

  return (
    <div
      className={styles.root}
      style={{
        marginLeft: isColumnOnLeft ? 0 : undefined,
        marginRight: isColumnOnLeft ? undefined : 0,
      }}
    >
      <div className={styles.titleWrapper}>
        <Typography variant="h2">{title}</Typography>
        {onPlusClick ? (
          <IconButton
            classes={{
              root: styles.button,
            }}
            onClick={onPlusClick}
          >
            {PlusIcon}
          </IconButton>
        ) : undefined}
      </div>
      {children}
    </div>
  );
};

export default RightMenuBox;
