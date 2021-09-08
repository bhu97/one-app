import { createTheme, ThemeOptions, Theme } from '@material-ui/core';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  // shadows: Array(25).fill('none') as Shadows,
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#0D2754',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#F3F5FB'
    }
  }
};

export default createTheme(themeConfig);