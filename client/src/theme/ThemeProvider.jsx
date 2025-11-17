import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeProvider = ({ children }) => {
  const { mode } = useSelector((state) => state.theme);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
            light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
            dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
            contrastText: '#fff',
          },
          secondary: {
            main: mode === 'dark' ? '#f48fb1' : '#dc004e',
            light: mode === 'dark' ? '#fce4ec' : '#f50057',
            dark: mode === 'dark' ? '#f50057' : '#c51162',
            contrastText: '#fff',
          },
          success: {
            main: mode === 'dark' ? '#66bb6a' : '#4caf50',
            light: mode === 'dark' ? '#81c784' : '#66bb6a',
            dark: mode === 'dark' ? '#388e3c' : '#2e7d32',
          },
          error: {
            main: mode === 'dark' ? '#f44336' : '#d32f2f',
            light: mode === 'dark' ? '#e57373' : '#ef5350',
            dark: mode === 'dark' ? '#c62828' : '#b71c1c',
          },
          warning: {
            main: mode === 'dark' ? '#ffa726' : '#ff9800',
            light: mode === 'dark' ? '#ffb74d' : '#ffb74d',
            dark: mode === 'dark' ? '#f57c00' : '#e65100',
          },
          info: {
            main: mode === 'dark' ? '#29b6f6' : '#0288d1',
            light: mode === 'dark' ? '#4fc3f7' : '#03a9f4',
            dark: mode === 'dark' ? '#0277bd' : '#01579b',
          },
          background: {
            default: mode === 'dark' ? '#0a0a0a' : '#ffffff',
            paper: mode === 'dark' ? '#1a1a1a' : '#ffffff',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#212121',
            secondary: mode === 'dark' ? '#b0b0b0' : '#757575',
          },
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '3rem',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.4,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.5,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          mode === 'dark'
            ? '0px 2px 4px rgba(0,0,0,0.5)'
            : '0px 2px 4px rgba(0,0,0,0.1)',
          mode === 'dark'
            ? '0px 4px 8px rgba(0,0,0,0.5)'
            : '0px 4px 8px rgba(0,0,0,0.1)',
          mode === 'dark'
            ? '0px 8px 16px rgba(0,0,0,0.5)'
            : '0px 8px 16px rgba(0,0,0,0.1)',
          mode === 'dark'
            ? '0px 12px 24px rgba(0,0,0,0.5)'
            : '0px 12px 24px rgba(0,0,0,0.1)',
          mode === 'dark'
            ? '0px 16px 32px rgba(0,0,0,0.5)'
            : '0px 16px 32px rgba(0,0,0,0.1)',
          ...Array(19).fill(
            mode === 'dark'
              ? '0px 20px 40px rgba(0,0,0,0.5)'
              : '0px 20px 40px rgba(0,0,0,0.1)'
          ),
        ],
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '10px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              },
              contained: {
                boxShadow: mode === 'dark' 
                  ? '0 4px 12px rgba(0,0,0,0.3)' 
                  : '0 4px 12px rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: mode === 'dark'
                    ? '0 8px 24px rgba(0,0,0,0.4)'
                    : '0 8px 24px rgba(0,0,0,0.12)',
                },
              },
              outlined: {
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: mode === 'dark' 
                  ? '1px solid rgba(255,255,255,0.08)' 
                  : '1px solid rgba(0,0,0,0.06)',
                boxShadow: mode === 'dark'
                  ? '0 4px 20px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.04)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: mode === 'dark'
                  ? '0 2px 8px rgba(0,0,0,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
