import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useEffect, useState } from 'react';

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
  })
);

interface IRightMenuBoxProps {
  title: string;
  isColumnOnLeft?: boolean;
}

export const RightMenuBox: FC<IRightMenuBoxProps> = ({
  title,
  children,
  isColumnOnLeft,
}) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        marginLeft: isColumnOnLeft ? 0 : undefined,
        marginRight: isColumnOnLeft ? undefined : 0,
      }}
    >
      <Typography variant="h2">{title}</Typography>
      {children}
    </div>
  );
};

export default RightMenuBox;
