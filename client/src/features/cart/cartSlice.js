import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  subtotal: 0,
  discount: 0,
  shippingCharge: 0,
  total: 0,
  couponCode: '',
  isLoading: false,
  isError: false,
  message: '',
};

// Get cart
export const getCart = createAsyncThunk('cart/get', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity, variant }, thunkAPI) => {
    try {
      const response = await api.post('/cart/items', { productId, quantity, variant });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId, thunkAPI) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Apply coupon
export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code, thunkAPI) => {
    try {
      const response = await api.post('/cart/coupon', { code });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    await api.delete('/cart');
    return { items: [], subtotal: 0, discount: 0, shippingCharge: 0, total: 0 };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.shippingCharge = 0;
      state.total = 0;
      state.couponCode = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCharge = action.payload.shippingCharge || 0;
        state.total = action.payload.total || 0;
        state.couponCode = action.payload.couponCode || '';
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.shippingCharge = action.payload.shippingCharge || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
        state.couponCode = action.payload.couponCode || '';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.discount = 0;
        state.shippingCharge = 0;
        state.total = 0;
        state.couponCode = '';
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
