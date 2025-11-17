import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  useScrollTrigger,
  Slide,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  ShoppingCart,
  Person,
  Dashboard,
  Logout,
  ShoppingBag,
  AdminPanelSettings,
  FavoriteBorder,
} from '@mui/icons-material';
import { toggleTheme } from '../../features/theme/themeSlice';
import { logout } from '../../features/auth/authSlice';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useSelector((state) => state.theme);
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const cartItemsCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: (theme) =>
            alpha(theme.palette.background.paper, 0.8),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo - Desktop */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
              }}
            >
              <ShoppingBag sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  letterSpacing: '-0.5px',
                }}
              >
                E-SHOP
              </Typography>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={RouterLink}
                    to={page.path}
                    selected={isActivePath(page.path)}
                  >
                    <Typography>{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
              }}
            >
              <ShoppingBag sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                }}
              >
                E-SHOP
              </Typography>
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActivePath(page.path) ? '80%' : '0%',
                      height: '3px',
                      backgroundColor: 'primary.main',
                      borderRadius: '3px 3px 0 0',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle */}
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton
                  onClick={() => dispatch(toggleTheme())}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>

              {/* Wishlist */}
              {token && (
                <Tooltip title="Wishlist">
                  <IconButton
                    component={RouterLink}
                    to="/wishlist"
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Badge badgeContent={wishlistCount} color="secondary">
                      <FavoriteBorder />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Cart */}
              <Tooltip title="Shopping Cart">
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Menu */}
              {token ? (
                <>
                  <Tooltip title="Account">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0.5,
                        border: (theme) => `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <Avatar
                        alt={user?.name}
                        src={user?.avatar}
                        sx={{ width: 36, height: 36 }}
                      >
                        {user?.name?.[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <MenuItem
                      component={RouterLink}
                      to="/dashboard"
                      onClick={handleCloseUserMenu}
                    >
                      <Dashboard sx={{ mr: 1.5, fontSize: 20 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/orders"
                      onClick={handleCloseUserMenu}
                    >
                      <ShoppingBag sx={{ mr: 1.5, fontSize: 20 }} />
                      My Orders
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem
                        component={RouterLink}
                        to="/admin"
                        onClick={handleCloseUserMenu}
                      >
                        <AdminPanelSettings sx={{ mr: 1.5, fontSize: 20 }} />
                        Admin Panel
                      </MenuItem>
                    )}
                    <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1 }}>
                      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                        Logout
                      </MenuItem>
                    </Box>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    startIcon={<Person />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      display: { xs: 'none', sm: 'flex' },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
