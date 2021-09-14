import { Container, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import theme from '../../../theme';
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
  },
}));

export const Layout: FunctionComponent = ({ children }) => {
  const styles = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={styles.root}>
        <Sidebar navigationEnabled={true} />
        <div className={styles.content}>
          <Container className={styles.main}>{children}</Container>
        </div>
      </main>
    </ThemeProvider>
  );
};

export default Layout;
