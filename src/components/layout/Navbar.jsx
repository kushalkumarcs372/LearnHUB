import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeModeContext';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
    AccountCircle,
    Dashboard,
    DarkMode,
    EmojiEvents,
    EventAvailable,
    Insights,
    LightMode,
    LibraryBooks,
    Logout,
    Menu as MenuIcon,
    MenuBook,
    School,
    SupportAgent,
} from '@mui/icons-material';

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('');
};

const Navbar = () => {
    const { user, logout, isAuthenticated, isStudent, isInstructor, isAdmin } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { mode, toggleMode } = useThemeMode();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const navItems = useMemo(() => {
        if (!isAuthenticated) {
            return [
                { label: 'Courses', to: '/courses', icon: <MenuBook /> },
                { label: 'Login', to: '/login', icon: <AccountCircle /> },
            ];
        }

        if (isStudent) {
            return [
                { label: 'Browse', to: '/courses', icon: <MenuBook /> },
                { label: 'Dashboard', to: '/student/dashboard', icon: <Dashboard /> },
                { label: 'My Courses', to: '/student/my-courses', icon: <LibraryBooks /> },
                { label: 'Certificates', to: '/student/certificates', icon: <EmojiEvents /> },
                { label: 'Analytics', to: '/student/progress', icon: <Insights /> },
            ];
        }

        if (isInstructor) {
            return [
                { label: 'Dashboard', to: '/instructor/dashboard', icon: <Dashboard /> },
                { label: 'My Courses', to: '/instructor/courses', icon: <School /> },
                { label: 'Guide Requests', to: '/instructor/guide-requests', icon: <SupportAgent /> },
                { label: 'Sessions', to: '/instructor/sessions', icon: <EventAvailable /> },
            ];
        }

        if (isAdmin) {
            return [{ label: 'Dashboard', to: '/', icon: <Dashboard /> }];
        }

        return [{ label: 'Home', to: '/', icon: <Dashboard /> }];
    }, [isAdmin, isAuthenticated, isInstructor, isStudent]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openUserMenu = (event) => setMenuAnchor(event.currentTarget);
    const closeUserMenu = () => setMenuAnchor(null);

    const renderNavButtons = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems
                .filter((item) => item.to !== '/login')
                .map((item) => (
                    <Button
                        key={item.to}
                        color="inherit"
                        component={RouterLink}
                        to={item.to}
                        sx={{ px: 1.25, borderRadius: 3 }}
                    >
                        {item.label}
                    </Button>
                ))}

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton
                    color="inherit"
                    onClick={toggleMode}
                    aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    sx={{
                        ml: 0.5,
                        border: `1px solid ${alpha('#ffffff', 0.22)}`,
                        bgcolor: alpha('#ffffff', 0.12),
                        '&:hover': { bgcolor: alpha('#ffffff', 0.18) },
                    }}
                >
                    {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
            </Tooltip>

            {!isAuthenticated ? (
                <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                    <Button color="inherit" component={RouterLink} to="/login" sx={{ borderRadius: 3 }}>
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/register"
                        sx={{
                            borderRadius: 3,
                            bgcolor: alpha('#ffffff', 0.14),
                            backgroundImage: 'none',
                            border: `1px solid ${alpha('#ffffff', 0.28)}`,
                            '&:hover': { bgcolor: alpha('#ffffff', 0.2), backgroundImage: 'none' },
                        }}
                    >
                        Get Started
                    </Button>
                </Box>
            ) : (
                <>
                    <Tooltip title={user?.name || 'Account'}>
                        <IconButton onClick={openUserMenu} sx={{ ml: 1 }}>
                            <Avatar
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: alpha('#ffffff', 0.2),
                                    border: `1px solid ${alpha('#ffffff', 0.25)}`,
                                }}
                            >
                                {getInitials(user?.name)}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={closeUserMenu}
                        PaperProps={{
                            sx: { borderRadius: 3, mt: 1, minWidth: 220 },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={800} noWrap>
                                {user?.name || 'Account'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                closeUserMenu();
                                navigate(isStudent ? '/student/dashboard' : isInstructor ? '/instructor/dashboard' : '/');
                            }}
                        >
                            <ListItemIcon>
                                <Dashboard fontSize="small" />
                            </ListItemIcon>
                            Dashboard
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                closeUserMenu();
                                handleLogout();
                            }}
                        >
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            )}
        </Box>
    );

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${alpha('#ffffff', 0.18)}`,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ py: 0.75 }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="Open navigation menu"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
                    >
                        <School />
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                            LearnHub
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {!isMobile && renderNavButtons()}
                </Toolbar>
            </Container>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 300, borderRadius: 0 } }}
            >
                <Box sx={{ px: 2, py: 2 }}>
                    <Typography variant="h6" fontWeight={900}>
                        LearnHub
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Learn. Practice. Get certified.
                    </Typography>
                </Box>
                <Divider />
                <List sx={{ px: 1 }}>
                    {navItems.map((item) => (
                        <ListItemButton
                            key={item.to}
                            onClick={() => {
                                setDrawerOpen(false);
                                navigate(item.to);
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                    <ListItemButton
                        onClick={() => {
                            toggleMode();
                        }}
                        sx={{ borderRadius: 2, mt: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            {mode === 'dark' ? <LightMode /> : <DarkMode />}
                        </ListItemIcon>
                        <ListItemText primary={mode === 'dark' ? 'Light mode' : 'Dark mode'} />
                    </ListItemButton>
                </List>
                <Box sx={{ flexGrow: 1 }} />
                {isAuthenticated && (
                    <Box sx={{ p: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Logout />}
                            onClick={() => {
                                setDrawerOpen(false);
                                handleLogout();
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
