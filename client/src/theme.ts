import { createTheme } from '@mui/material/styles'

export const fonts = {
  display: '"Fraunces Variable", Georgia, "Times New Roman", serif',
  body: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
}

export const colors = {
  paper: '#F2E9D5',
  paperRaised: '#F9F3E4',
  ink: '#26211B',
  inkMuted: '#6E6353',
  rule: '#D9CBAD',
  teal: '#0F5E63',
  tealDark: '#0A4347',
  marigold: '#E9A23B',
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.teal, dark: colors.tealDark, contrastText: colors.paperRaised },
    secondary: { main: colors.marigold, contrastText: colors.ink },
    background: { default: colors.paper, paper: colors.paperRaised },
    text: { primary: colors.ink, secondary: colors.inkMuted },
    divider: colors.rule,
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: fonts.body,
    h4: { fontFamily: fonts.display, fontWeight: 600 },
    h5: { fontFamily: fonts.display, fontWeight: 600 },
    h6: { fontFamily: fonts.display, fontWeight: 600 },
    subtitle1: { fontFamily: fonts.display, fontWeight: 600 },
    subtitle2: { fontFamily: fonts.display, fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 },
    caption: { fontFamily: fonts.mono, fontSize: '0.72rem', letterSpacing: '0.02em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':focus-visible': { outline: `2px solid ${colors.teal}`, outlineOffset: 2 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.rule}`,
          backgroundColor: colors.paperRaised,
          transition: 'box-shadow 150ms ease, transform 150ms ease, border-color 150ms ease',
          '&:hover': {
            borderColor: colors.inkMuted,
            boxShadow: '0 10px 24px rgba(38, 33, 27, 0.14)',
            transform: 'translateY(-2px)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': { transform: 'none' },
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        iconFilled: { color: colors.marigold },
        iconEmpty: { color: colors.rule },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: fonts.mono,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          borderRadius: 2,
        },
        outlined: { borderColor: colors.rule },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { fontFamily: fonts.mono, borderRadius: 2 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: colors.paperRaised },
        notchedOutline: { borderColor: colors.rule },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: '#E6DABE' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { border: `1px solid ${colors.rule}`, backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2 },
      },
    },
  },
})
