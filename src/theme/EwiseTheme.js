import { createTheme } from '@mui/material';

/* E-Wise Colors */
const PrimaryColor = '#760f4e';
const SecondaryColor = '#e27739';
const PrimaryBlue = '#2B3674';
const BackgroundColor = 'rgba(119, 26, 81, 0.05);';
const RedColor = '#FF5B5B';

/* Margins */
const DefaultMarginMin = '8px';
const DefaultMarginMid = '16px';

const ewiseTheme = createTheme({
  palette: {
    primary: {
      main: PrimaryColor
    },
    secondary: {
      main: SecondaryColor
    },
    background: {
      main: BackgroundColor
    },
    primaryBlue: {
      main: PrimaryBlue
    },
    tabPrimaryBlue: {
      main: PrimaryColor
    },
    favoriteRed: {
      main: RedColor
    }
  },
  typography: {
    h1: {
      fontSize: '40px',
      fontWeight: '600'
    },
    h2: {
      fontSize: '38px',
      fontWeight: '600'
    },
    h3: {
      fontSize: '36px',
      fontWeight: '600'
    },
    h4: {
      fontSize: '34px',
      fontWeight: '600'
    },
    h5: {
      fontSize: '30px',
      fontWeight: '600'
    },
    h6: {
      fontSize: '38px',
      fontWeight: '600'
    },
    subtitle1: {
      fontSize: '26px'
    },
    subtitle2: {
      fontSize: '26px'
    },
    button: {
      fontSize: '14px'
    },
    caption: {
      fontSize: '12px'
    },
    overline: {
      fontSize: '12px'
    }
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          margin: '0 auto',
          width: '100%'
        }
      }
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
          marginTop: DefaultMarginMid,
          marginBottom: DefaultMarginMid
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          marginTop: DefaultMarginMin,
          marginBottom: DefaultMarginMin
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: DefaultMarginMid,
          marginBottom: DefaultMarginMid
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'rgb(0 0 0 / 15%) 1.95px 1.95px 2.6px'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '&.Mui-checked.MuiSwitch-track': {
            background: PrimaryColor
          },
          '& .MuiSwitch-track': {
            background: '#E0E5F2'
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: PrimaryColor
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: PrimaryColor
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        label: {
          color: PrimaryColor
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: PrimaryColor
          }
        }
      }
    },
    MuiListItem: {
      MuiTypography: {
        styleOverrides: {
          root: {
            margin: '0px'
          }
        }
      }
    }
  }
});

export default ewiseTheme;
