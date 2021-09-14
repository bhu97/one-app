import { Container, makeStyles, Typography } from '@material-ui/core';
import React, { FC, Fragment } from 'react';
import Sidebar from 'renderer/components/organisms/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
}));

type SettingsPageProps = {};
export const SettingsPage: FC<SettingsPageProps> = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <main className={classes.root}>
        <Sidebar navigationEnabled={true}></Sidebar>
        <div className={classes.content}>
          <Container className={classes.main}>
            <Typography>Settings</Typography>
          </Container>
        </div>
      </main>
    </Fragment>
  );
};

export default SettingsPage;
