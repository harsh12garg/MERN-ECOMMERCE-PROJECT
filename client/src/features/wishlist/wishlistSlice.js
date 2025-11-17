import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get wishlist
export const getWishlist = createAsyncThunk('wishlist/get', async (_, thunkAPI) => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, thunkAPI) => {
    try {
      const response = await api.post('/wishlist', { productId });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, thunkAPI) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.items = [];
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both formats: direct products array or nested in wishlist object
        const products = action.payload.products || action.payload || [];
        state.items = products.map(item => item.product || item);
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const products = action.payload.products || action.payload || [];
        state.items = products.map(item => item.product || item);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const products = action.payload.products || action.payload || [];
        state.items = products.map(item => item.product || item);
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
