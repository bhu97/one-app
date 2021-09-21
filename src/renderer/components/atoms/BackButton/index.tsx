import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { BackArrowIcon } from '../../../svg';

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fill: theme.palette.primary.main,
    background: theme.palette.background.paper,
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
  },
}));

interface IBackButtonProps {
  onClick: () => void;
  isHidden?: boolean;
}

export const BackButton: FC<IBackButtonProps> = ({ onClick, isHidden }) => {
  const styles = useStyles();
  return (
    <div
      className={styles.root}
      onClick={onClick}
      role="button"
      style={{
        visibility: isHidden ? 'hidden' : 'unset',
      }}
    >
      {BackArrowIcon}
    </div>
  );
};

export default BackButton;
