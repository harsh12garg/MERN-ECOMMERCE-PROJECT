import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import { FavoriteBorder, ShoppingCart, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import ProductCard from '../components/Products/ProductCard';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={RouterLink}
            to="/products"
            startIcon={<ArrowBack />}
            sx={{ mb: 2 }}
          >
            Continue Shopping
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FavoriteBorder sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight={800}>
              My Wishlist
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {items?.length || 0} {items?.length === 1 ? 'item' : 'items'} saved for later
          </Typography>
        </Box>

        {/* Empty State */}
        {!items || items.length === 0 ? (
          <Card
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <FavoriteBorder sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Your Wishlist is Empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Save your favorite items here to buy them later
              </Typography>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Wishlist Items */}
            <Grid container spacing={3}>
              {items.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard
                    product={product}
                    onRemoveFromWishlist={() => handleRemoveFromWishlist(product._id)}
                    showRemoveButton
                  />
                </Grid>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                mt: 6,
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Ready to Purchase?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add items to your cart and complete your order
                </Typography>
              </Box>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default WishlistPage;
