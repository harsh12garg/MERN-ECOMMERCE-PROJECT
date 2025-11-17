import { Container, Typography, Box, Grid, Card, CardContent, alpha } from '@mui/material';
import {
  Verified,
  LocalShipping,
  SupportAgent,
  Security,
  TrendingUp,
  Groups,
} from '@mui/icons-material';

const features = [
  {
    icon: <Verified sx={{ fontSize: 48 }} />,
    title: 'Quality Products',
    description: 'Every product is carefully selected and verified for authenticity and quality standards.',
  },
  {
    icon: <LocalShipping sx={{ fontSize: 48 }} />,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping with real-time tracking for all your orders.',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 48 }} />,
    title: '24/7 Support',
    description: 'Our dedicated support team is always ready to help you with any questions.',
  },
  {
    icon: <Security sx={{ fontSize: 48 }} />,
    title: 'Secure Shopping',
    description: 'Your data is protected with industry-leading security measures and encryption.',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 48 }} />,
    title: 'Best Prices',
    description: 'Competitive pricing with regular deals and discounts on premium products.',
  },
  {
    icon: <Groups sx={{ fontSize: 48 }} />,
    title: 'Community',
    description: 'Join thousands of satisfied customers who trust us for their shopping needs.',
  },
];

const AboutPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: { xs: 8, md: 12 },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                color: 'primary.main',
              }}
            >
              About E-Shop
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6 }}
            >
              Your trusted destination for premium products and exceptional shopping experiences
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom fontWeight={700}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Founded in 2024, E-Shop emerged from a simple vision: to create a shopping platform that
              combines quality, convenience, and trust. We started with a passion for connecting people
              with products they love.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Today, we've grown into a thriving marketplace serving thousands of customers worldwide.
              Our commitment to excellence drives everything we do, from product selection to customer
              service.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              We believe shopping should be enjoyable, secure, and rewarding. That's why we continuously
              innovate to bring you the best possible experience.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 4,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                alt="Our Story"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom fontWeight={700}>
              Why Choose Us
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              We're committed to providing you with the best shopping experience possible
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
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
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Ready to Start Shopping?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join our community and discover amazing products today
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage;
