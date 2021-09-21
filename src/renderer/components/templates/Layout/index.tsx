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
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    position: 'relative',
  },
}));

export const Layout: FunctionComponent = ({ children }) => {
  const styles = useStyles();

  return (
    <ThemeProvider theme={themeOverrides}>
      <CssBaseline />
      <main className={styles.root}>
        <Sidebar navigationEnabled />
        <div className={styles.content}>
          <div className={styles.main}>{children || ''}</div>
        </div>
      </main>
    </ThemeProvider>
  );
};

export default Layout;
