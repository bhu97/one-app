import React, { FunctionComponent } from 'react';

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import FavoritesIcon from '@material-ui/icons/Star';
import CartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
// import SettingsIcon from '@material-ui/icons/Settings';
import { matchPath, useLocation, Link } from 'react-router-dom';

const drawerWidth = 215;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: "#555555"
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  menuItem: {
    padding: `${theme.spacing(1, 3)} !important`,
  },
}));

interface SidebarProps {
  navigationEnabled: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ navigationEnabled }) => {
  const styles = useStyles();

  const location = useLocation();
  const configuratorActive =
    matchPath(location.pathname, '/configurator') !== null;
  // const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const favoritesActive = matchPath(location.pathname, '/favorites') !== null;
  const cartActive =
    matchPath(location.pathname, '/cart') !== null;
  const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const homeActive = matchPath(location.pathname, '/home') !== null;
  return (
    <Drawer
      className={styles.drawer}
      variant="permanent"
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <Toolbar />
      <Divider />
      <div className={styles.drawerContainer}>
        <List>
          <ListItem
            component={Link}
            to="/home"
            selected={homeActive}
            className={styles.menuItem}
            button 
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            component={Link}
            to="/favorites"
            selected={favoritesActive}
            className={styles.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <FavoritesIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
          </ListItem>

          <ListItem
            component={Link}
            to="/cart"
            selected={cartActive}
            className={styles.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <CartIcon />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>

          <ListItem
            component={Link}
            to="/settings"
            selected={settingsActive}
            className={styles.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;