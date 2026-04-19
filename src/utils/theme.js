import { alpha, createTheme } from '@mui/material/styles';

const brand = {
    primary: { main: '#667eea', dark: '#4f46e5' },
    secondary: { main: '#764ba2', dark: '#5b2d86' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#38bdf8' },
};

const transitions = {
    fast: '150ms',
    normal: '220ms',
    slow: '320ms',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

export const getTheme = (mode = 'light') => {
    const isDark = mode === 'dark';

    const backgroundDefault = isDark ? '#070a14' : '#f6f7fb';
    const backgroundPaper = isDark ? '#0b1224' : '#ffffff';
    const borderColor = isDark ? alpha('#ffffff', 0.08) : alpha('#0f172a', 0.06);

    const primaryGradient = `linear-gradient(135deg, ${brand.primary.main} 0%, ${brand.secondary.main} 100%)`;
    const primaryGradientHover = `linear-gradient(135deg, ${brand.primary.dark} 0%, ${brand.secondary.dark} 100%)`;

    return createTheme({
        palette: {
            mode,
            primary: brand.primary,
            secondary: brand.secondary,
            success: brand.success,
            warning: brand.warning,
            error: brand.error,
            info: brand.info,
            background: { default: backgroundDefault, paper: backgroundPaper },
            text: isDark
                ? { primary: '#e6e8f0', secondary: alpha('#e6e8f0', 0.72) }
                : { primary: '#0f172a', secondary: '#475569' },
        },
        shape: { borderRadius: 16 },
        typography: {
            fontFamily:
                'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            h1: { fontWeight: 900, letterSpacing: -1.2 },
            h2: { fontWeight: 900, letterSpacing: -1 },
            h3: { fontWeight: 900, letterSpacing: -0.8 },
            h4: { fontWeight: 900, letterSpacing: -0.6 },
            h5: { fontWeight: 800, letterSpacing: -0.4 },
            h6: { fontWeight: 800, letterSpacing: -0.2 },
            button: { textTransform: 'none', fontWeight: 800, letterSpacing: 0 },
        },
        custom: {
            transitions,
            gradients: {
                primary: primaryGradient,
                primaryHover: primaryGradientHover,
                success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                glass: isDark
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.72) 100%)',
            },
            shadows: {
                card: isDark
                    ? '0 18px 50px rgba(0, 0, 0, 0.55)'
                    : '0 10px 30px rgba(15, 23, 42, 0.06), 0 1px 0 rgba(15, 23, 42, 0.04)',
                cardHover: isDark ? '0 28px 80px rgba(0, 0, 0, 0.65)' : '0 20px 50px rgba(15, 23, 42, 0.12)',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundImage: isDark
                            ? 'radial-gradient(1100px 520px at 0% 0%, rgba(102,126,234,0.22) 0%, rgba(102,126,234,0) 55%), radial-gradient(900px 440px at 100% 10%, rgba(118,75,162,0.20) 0%, rgba(118,75,162,0) 50%)'
                            : 'radial-gradient(1200px 600px at 0% 0%, rgba(102,126,234,0.10) 0%, rgba(102,126,234,0) 50%), radial-gradient(1000px 500px at 100% 10%, rgba(118,75,162,0.10) 0%, rgba(118,75,162,0) 45%)',
                        backgroundAttachment: 'fixed',
                    },
                    '::selection': { backgroundColor: alpha(brand.primary.main, 0.24) },
                    '*': { boxSizing: 'border-box' },
                    'a, button, [role="button"], input, select, textarea, [tabindex]': {
                        outline: 'none',
                    },
                    '*:focus-visible': {
                        boxShadow: `0 0 0 4px ${alpha(brand.primary.main, isDark ? 0.35 : 0.22)}`,
                        borderRadius: 10,
                    },
                    '::-webkit-scrollbar': { width: 10 },
                    '::-webkit-scrollbar-track': { background: alpha(isDark ? '#ffffff' : '#0f172a', 0.08) },
                    '::-webkit-scrollbar-thumb': {
                        background: alpha(isDark ? '#ffffff' : '#0f172a', isDark ? 0.22 : 0.28),
                        borderRadius: 10,
                    },
                    '::-webkit-scrollbar-thumb:hover': {
                        background: alpha(isDark ? '#ffffff' : '#0f172a', isDark ? 0.28 : 0.38),
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                        'html:focus-within': { scrollBehavior: 'auto' },
                        '*': { animationDuration: '0.001ms !important', transitionDuration: '0.001ms !important' },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        border: `1px solid ${borderColor}`,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark
                            ? '0 18px 55px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,255,0.05)'
                            : '0 10px 30px rgba(15, 23, 42, 0.06), 0 1px 0 rgba(15, 23, 42, 0.04)',
                    },
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        transition: `transform ${transitions.normal} ${transitions.easeOut}, background-color ${transitions.normal} ${transitions.easeOut}, box-shadow ${transitions.normal} ${transitions.easeOut}, border-color ${transitions.normal} ${transitions.easeOut}`,
                        '&:active': { transform: 'translateY(0.5px)' },
                    },
                    containedPrimary: {
                        backgroundImage: primaryGradient,
                        '&:hover': { backgroundImage: primaryGradientHover },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: primaryGradient,
                        backdropFilter: 'blur(10px)',
                    },
                },
            },
            MuiChip: {
                styleOverrides: { root: { borderRadius: 999 } },
            },
            MuiTextField: { defaultProps: { variant: 'outlined' } },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        transition: `box-shadow ${transitions.normal} ${transitions.easeOut}`,
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 4px ${alpha(brand.primary.main, isDark ? 0.28 : 0.18)}`,
                        },
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 18,
                        border: `1px solid ${borderColor}`,
                    },
                },
            },
        },
    });
};

export const theme = getTheme('light');
