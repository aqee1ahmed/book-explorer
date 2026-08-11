import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3f51b5' },
    background: { default: '#f7f8fa', paper: '#ffffff' },
    text: { primary: '#1a2027', secondary: '#5f6b7a' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #e3e8ef',
          transition: 'box-shadow 150ms ease, transform 150ms ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(26, 32, 39, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
})
