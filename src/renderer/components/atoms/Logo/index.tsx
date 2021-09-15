import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

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
  // TODO Link causes flashing
  return (
    <div className={styles.logo}>
      <Link to="/">{LogoIcon}</Link>
    </div>
  );
};

export default Logo;
