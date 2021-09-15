import { Drawer, makeStyles } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import { Logo } from '../../atoms';
import { Navigation } from '../../molecules';

const drawerWidth = 215;
const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    width: drawerWidth,
    [theme.breakpoints.down('md')]: {
      width: 'unset',
    },
  },
  drawerPaper: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    position: 'relative',
  },
  drawerContainer: {
    overflow: 'auto',
  },
}));

interface SidebarProps {
  navigationEnabled: boolean;
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
  navigationEnabled,
}) => {
  const styles = useStyles();

  return (
    <Drawer
      className={styles.drawer}
      variant="permanent"
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <Logo />
      <div className={styles.drawerContainer}>
        <Navigation navigationEnabled={navigationEnabled} />
      </div>
    </Drawer>
  );
};

export default Sidebar;
