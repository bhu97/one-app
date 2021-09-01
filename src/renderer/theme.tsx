import { createTheme, ThemeOptions, Theme } from '@material-ui/core';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  // shadows: Array(25).fill('none') as Shadows,
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
};

export default createTheme(themeConfig);