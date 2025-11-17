import { Container, Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { Person, ShoppingBag, Favorite } from '@mui/icons-material';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your account
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom>
                Wishlist
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your favorite items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Name:</strong> {user?.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {user?.role}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
