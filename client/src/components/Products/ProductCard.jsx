import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';

const ProductCard = ({ product, showRemoveButton = false, onRemoveFromWishlist }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);
  
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const isInWishlist = wishlistItems?.some((item) => item._id === product._id || item.product?._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart!');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add to cart');
      });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.success('Removed from wishlist');
        })
        .catch((error) => {
          toast.error(error || 'Failed to remove from wishlist');
        });
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.success('Added to wishlist!');
        })
        .catch((error) => {
          toast.error(error || 'Failed to add to wishlist');
        });
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s',
        },
      }}
    >
      {hasDiscount && (
        <Chip
          label={`${product.discountPercentage || product.discount}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        />
      )}

      <IconButton
        onClick={handleWishlistToggle}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1,
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        {isInWishlist ? (
          <Favorite sx={{ color: 'error.main' }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      <CardMedia
        component={Link}
        to={`/products/${product._id}`}
        sx={{
          height: 250,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <Box
          component="img"
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </CardMedia>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase' }}
        >
          {product.category?.name}
        </Typography>
        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product._id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          <Rating value={product.rating || 0} readOnly size="small" precision={0.5} />
          <Typography variant="caption" color="text.secondary">
            ({product.numReviews || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          {hasDiscount && (
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              ${product.comparePrice}
            </Typography>
          )}
        </Box>

        {product.stock === 0 && (
          <Chip label="Out of Stock" color="error" size="small" sx={{ mt: 1 }} />
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {showRemoveButton ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={(e) => {
                e.preventDefault();
                onRemoveFromWishlist && onRemoveFromWishlist();
              }}
            >
              Remove from Wishlist
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart />}
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
