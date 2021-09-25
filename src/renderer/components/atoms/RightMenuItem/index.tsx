import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { LoadingDialog } from '../Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '68px',
    padding: theme.spacing(1, 2),
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[300],
  },
  text: {},
  icon: {
    display: 'flex',
    width: '40px',
    height: '40px',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    background: theme.palette.background.paper,
    '& svg': {
      height: '50%',
      width: '50%',
    },
  },
}));

interface IRightMenuItemProps {
  key: string;
  onClick?: () => void;
  text?: string;
  icon: JSX.Element;
  isLoading?: boolean;
}

export const RightMenuItem: FC<IRightMenuItemProps> = ({
  key,
  onClick,
  text,
  icon,
  isLoading,
}) => {
  const styles = useStyles();
  return (
    <ListItem
      key={key}
      classes={{
        root: styles.root,
      }}
      onClick={onClick}
      button={onClick ? true : undefined}
    >
      <div className={styles.icon}>{icon}</div>
      <ListItemText
        primary={text}
        classes={{
          primary: styles.text,
        }}
      />
      <LoadingDialog open={!!isLoading} />
    </ListItem>
  );
};

export default RightMenuItem;
