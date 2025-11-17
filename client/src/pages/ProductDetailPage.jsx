import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Divider,
  TextField,
  Card,
  CardContent,
  Avatar,
  IconButton,
  ImageList,
  ImageListItem,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Verified,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api';
import { addToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const isInWishlist = wishlistItems.some(item => item._id === product?._id);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: parseInt(quantity) 
      })).unwrap();
      toast.success('Product added to cart successfully');
    } catch (error) {
      toast.error(error || 'Failed to add product to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to manage wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error || 'Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        });
        toast.success('Shared successfully');
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopyLink(url);
        }
      }
    } else {
      handleCopyLink(url);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review submitted successfully');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box
              component="img"
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2,
              }}
            />
            <ImageList cols={4} gap={8}>
              {product.images.map((image, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedImage === index ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 1,
                  }}
                >
                  <img src={image.url} alt={`${product.name} ${index + 1}`} />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Chip label={product.category?.name} color="primary" size="small" sx={{ mb: 1 }} />
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({product.numReviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
              <Typography variant="h4" color="primary">
                ${product.price}
              </Typography>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <Typography
                    variant="h6"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    ${product.comparePrice}
                  </Typography>
                  <Chip
                    label={`${product.discountPercentage || 0}% OFF`}
                    color="error"
                    size="small"
                  />
                </>
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Stock Status */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Typography>
            </Box>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography>Quantity:</Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(product.stock, value)));
                  }}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 100 }}
                />
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                fullWidth
              >
                Add to Cart
              </Button>
              <IconButton 
                color="primary" 
                onClick={handleToggleWishlist}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <IconButton onClick={handleShare} title="Share product">
                <Share />
              </IconButton>
            </Box>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="primary" />
                <Typography variant="body2">Free shipping on orders over $50</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                <Typography variant="body2">Secure payment</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Verified color="primary" />
                <Typography variant="body2">Quality guaranteed</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>

        {/* Submit Review */}
        {user && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>
              <Box component="form" onSubmit={handleSubmitReview}>
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    value={reviewRating}
                    onChange={(e, newValue) => setReviewRating(newValue)}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Review"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <Card key={review._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar>{review.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle1">{review.name}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary">No reviews yet</Typography>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
