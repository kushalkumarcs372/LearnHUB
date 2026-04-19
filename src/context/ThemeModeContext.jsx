import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MotionConfig } from 'framer-motion';
import { getTheme } from '../utils/theme';

const ThemeModeContext = createContext(null);

const STORAGE_KEY = 'learnhub.themeMode';

const getInitialMode = () => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        // ignore
    }

    try {
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
        return prefersDark ? 'dark' : 'light';
    } catch {
        return 'light';
    }
};

export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState(getInitialMode);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, mode);
        } catch {
            // ignore
        }
        document.documentElement.style.colorScheme = mode;
        document.documentElement.dataset.theme = mode;
    }, [mode]);

    const toggleMode = useCallback(() => {
        setMode((current) => (current === 'light' ? 'dark' : 'light'));
    }, []);

    const theme = useMemo(() => getTheme(mode), [mode]);
    const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, toggleMode]);

    return (
        <ThemeModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                    {children}
                </MotionConfig>
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider');
    return context;
};
