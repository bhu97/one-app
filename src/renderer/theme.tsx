import { createTheme, Theme, ThemeOptions } from '@material-ui/core';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  // shadows: Array(25).fill('none') as Shadows,
  shape: {
    borderRadius: 0,
  },
  typography: (palette) => ({
    h1: {
      fontSize: '30px',
      fontWeight: 500,
      color: palette.primary.main,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 500,
      color: palette.primary.main,
    },
  }),
  palette: {
    primary: {
      main: '#071B45',
    },
    secondary: {
      main: '#f48fb1',
    },
    error: {
      main: '#E3467D',
    },
    grey: {
      300: '#EEEDEB',
      600: '#A8A39D',
      900: '#333333',
    },
    background: {
      default: '#F0F2FB',
      paper: '#fff',
    },
  },
};

export default createTheme(themeConfig);
