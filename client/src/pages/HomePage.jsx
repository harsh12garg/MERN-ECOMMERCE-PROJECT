import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  ShoppingCart,
  LocalShipping,
  Security,
  Verified,
  TrendingUp,
  Support,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const features = [
  {
    icon: <ShoppingCart sx={{ fontSize: 48 }} />,
    title: 'Easy Shopping',
    description: 'Browse thousands of products with our intuitive interface',
    color: '#1976d2',
  },
  {
    icon: <LocalShipping sx={{ fontSize: 48 }} />,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $50 with tracking',
    color: '#2e7d32',
  },
  {
    icon: <Security sx={{ fontSize: 48 }} />,
    title: 'Secure Payment',
    description: '100% secure transactions with encrypted checkout',
    color: '#ed6c02',
  },
  {
    icon: <Verified sx={{ fontSize: 48 }} />,
    title: 'Quality Guaranteed',
    description: 'All products verified for authenticity and quality',
    color: '#9c27b0',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'Best Prices',
    description: 'Competitive pricing with regular discounts and deals',
    color: '#d32f2f',
  },
  {
    icon: <Support sx={{ fontSize: 48 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for your needs',
    color: '#0288d1',
  },
];

const HomePage = () => {
  return (
    <Box>
      {/* Welcome Text Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          py: { xs: 10, md: 14 },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: 'center' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                fontWeight: 900,
                mb: 3,
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: { xs: 2, md: 4 },
                lineHeight: 1.2,
              }}
            >
              Welcome to E-Shop
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Your Ultimate Shopping Destination
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                maxWidth: 800,
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
              }}
            >
              Discover Premium Products • Unbeatable Prices • Fast Delivery
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: '1.2rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Shopping
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'text.primary',
            }}
          >
            Why Choose E-Shop?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We provide the best shopping experience with top-notch service and quality products
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: { xs: 8, md: 10 },
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'text.primary',
              }}
            >
              Ready to Start Shopping?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
              Join thousands of satisfied customers and discover amazing deals today
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 5,
                fontSize: '1.1rem',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
