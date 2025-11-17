import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getCart, clearCart } from '../features/cart/cartSlice';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, discount, shippingCharge, total } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    dispatch(getCart());
    fetchAddresses();
  }, [user, dispatch, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data);
      const defaultAddr = response.data.find((addr) => addr.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch (error) {
      console.error('Failed to load addresses');
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await api.post('/addresses', newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data);
      setOpenAddressDialog(false);
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const orderData = {
        shippingAddress: selectedAddress,
        paymentMethod,
      };

      const response = await api.post('/orders', orderData);
      const order = response.data;

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        navigate(`/orders/${order._id}`);
      } else {
        // Create payment intent
        const paymentResponse = await api.post(`/orders/${order._id}/payment-intent`);
        
        if (paymentMethod === 'stripe') {
          // Redirect to Stripe checkout or handle client-side
          toast.info('Redirecting to payment...');
          // Implement Stripe payment flow
        } else if (paymentMethod === 'razorpay') {
          // Handle Razorpay payment
          handleRazorpayPayment(order, paymentResponse.data);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = (order, paymentData) => {
    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: 'E-Shop',
      description: `Order #${order.orderNumber}`,
      order_id: paymentData.orderId,
      handler: async function (response) {
        try {
          await api.put(`/orders/${order._id}/pay`, {
            method: 'razorpay',
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          toast.success('Payment successful!');
          dispatch(clearCart());
          navigate(`/orders/${order._id}`);
        } catch (error) {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: selectedAddress.phone,
      },
      theme: {
        color: '#1976d2',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (items.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Step 1: Shipping Address */}
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Shipping Address</Typography>
                  <Button onClick={() => setOpenAddressDialog(true)}>Add New</Button>
                </Box>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selectedAddress?._id || ''}
                    onChange={(e) => {
                      const addr = addresses.find((a) => a._id === e.target.value);
                      setSelectedAddress(addr);
                    }}
                  >
                    {addresses.map((address) => (
                      <Card key={address._id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <FormControlLabel
                            value={address._id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">{address.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.addressLine1}, {address.addressLine2}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.city}, {address.state} {address.zipCode}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Phone: {address.phone}
                                </Typography>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Method
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="stripe"
                      control={<Radio />}
                      label="Credit/Debit Card (Stripe)"
                    />
                    <FormControlLabel
                      value="razorpay"
                      control={<Radio />}
                      label="Razorpay"
                    />
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label="Cash on Delivery"
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review Order */}
          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Review Your Order
                </Typography>
                <List>
                  {items.map((item) => (
                    <ListItem key={item._id}>
                      <Box
                        component="img"
                        src={item.product?.images?.[0]?.url}
                        sx={{ width: 60, height: 60, objectFit: 'cover', mr: 2 }}
                      />
                      <ListItemText
                        primary={item.product?.name}
                        secondary={`Qty: ${item.quantity} × $${item.price}`}
                      />
                      <Typography>${(item.quantity * item.price).toFixed(2)}</Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Place Order'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Discount:</Typography>
                  <Typography color="success.main">-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>
                  {shippingCharge === 0 ? 'FREE' : `$${shippingCharge.toFixed(2)}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Address Dialog */}
      <Dialog open={openAddressDialog} onClose={() => setOpenAddressDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddressDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAddress} variant="contained">
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckoutPage;
