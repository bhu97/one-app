import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import themeOverrides from '../../../theme';
import { Sidebar } from '../../organisms';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    padding: theme.spacing(6, 4, 0),
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
}));

export const Layout: FunctionComponent = ({ children }) => {
  const styles = useStyles();

  return (
    <ThemeProvider theme={themeOverrides}>
      <CssBaseline />
      <div className={styles.root}>
        <Sidebar navigationEnabled />
        <main className={styles.main}>{children || ''}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
