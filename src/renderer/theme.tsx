import { createTheme, Theme, ThemeOptions } from '@material-ui/core';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  // shadows: Array(25).fill('none') as Shadows,
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#071B45',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#F3F5FB',
      paper: '#fff',
    },
  },
};

export default createTheme(themeConfig);
