import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { LogoIcon } from '../../../svg';

const useStyles = makeStyles((theme) => ({
  logo: {
    padding: theme.spacing(6, 3),
    fill: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const Logo: FC = () => {
  const styles = useStyles();
  return <div className={styles.logo}>{LogoIcon}</div>;
};

export default Logo;
