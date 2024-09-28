import { createTheme } from '@mui/material';

/* PE Colors */
const PrimaryColor = '#006846';
const SecondaryColor = '#e27739';
const RedColor = '#FF5B5B';
const BackgroundColor = '#F4F7FE';
const PrimaryBlue = '#2B3674';
const TabPrimaryBlue = '#2B3674';

/* Margins */
const DefaultMargin = '10px';

/* Paddings */
// const DefaultPaddings       = '10px';

const peTheme = createTheme({
  palette: {
    primary: {
      main: PrimaryColor
    },
    secondary: {
      main: SecondaryColor
    },
    favoriteRed: {
      main: RedColor
    },
    background: {
      main: BackgroundColor
    },
    primaryBlue: {
      main: PrimaryBlue
    },
    tabPrimaryBlue: {
      main: TabPrimaryBlue
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
          // maxWidth: '98%',
          width: '100%'
        }
      }
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
          marginTop: DefaultMargin,
          marginBottom: DefaultMargin
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          marginTop: DefaultMargin,
          marginBottom: DefaultMargin
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: DefaultMargin,
          marginBottom: DefaultMargin
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
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: BackgroundColor,
          color: PrimaryColor
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

export default peTheme;
