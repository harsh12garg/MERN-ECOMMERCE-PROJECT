import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  TextField,
  Button,
  Divider,
  Stack,
  alpha,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  ShoppingBag,
  Send,
  Favorite,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const footerLinks = {
  shop: [
    { name: 'All Products', path: '/products' },
    { name: 'New Arrivals', path: '/products?sort=newest' },
    { name: 'Best Sellers', path: '/products?sort=popular' },
    { name: 'On Sale', path: '/products?discount=true' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
  ],
  support: [
    { name: 'Help Center', path: '/help' },
    { name: 'Track Order', path: '/orders' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns', path: '/returns' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Sitemap', path: '/sitemap' },
  ],
};

const socialLinks = [
  { icon: <Facebook />, url: 'https://facebook.com', label: 'Facebook' },
  { icon: <Twitter />, url: 'https://twitter.com', label: 'Twitter' },
  { icon: <Instagram />, url: 'https://instagram.com', label: 'Instagram' },
  { icon: <LinkedIn />, url: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <YouTube />, url: 'https://youtube.com', label: 'YouTube' },
];

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {/* Newsletter Section */}
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.05),
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Email sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Subscribe to Our Newsletter
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get the latest updates on new products and upcoming sales
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                onSubmit={handleNewsletterSubmit}
                sx={{ display: 'flex', gap: 1 }}
              >
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  type="email"
                  required
                  size="medium"
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<Send />}
                  sx={{ px: 4, whiteSpace: 'nowrap' }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingBag sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  E-SHOP
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Your trusted destination for premium products. We bring quality, style, and
                convenience to your doorstep.
              </Typography>

              {/* Contact Info */}
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Phone sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Email sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    support@eshop.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    123 E-Shop Street, New York, NY 10001
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Shop
            </Typography>
            <Stack spacing={1}>
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Support
            </Typography>
            <Stack spacing={1}>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Social Media Section */}
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 4 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} E-Shop. All rights reserved. Made with{' '}
              <Favorite sx={{ fontSize: 14, color: 'error.main', verticalAlign: 'middle' }} /> by
              E-Shop Team
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Payment Methods */}
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.5)
              : alpha(theme.palette.grey[100], 0.5),
          py: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Secure Payment Methods
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              >
                VISA
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              >
                MASTERCARD
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              >
                PAYPAL
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              >
                STRIPE
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
