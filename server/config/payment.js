import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Stripe Configuration
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Razorpay Configuration
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// Create Stripe Payment Intent
export const createStripePaymentIntent = async (order) => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

// Create Razorpay Order
export const createRazorpayOrder = async (order) => {
  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // Convert to paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order._id.toString(),
    },
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }

  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
};

// Verify Stripe Payment
export const verifyStripePayment = async (paymentIntentId) => {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.status === 'succeeded';
};

// Generic payment intent creator
export const createPaymentIntent = async (order) => {
  const paymentMethod = order.paymentMethod;

  if (paymentMethod === 'stripe') {
    return await createStripePaymentIntent(order);
  } else if (paymentMethod === 'razorpay') {
    return await createRazorpayOrder(order);
  } else if (paymentMethod === 'cod') {
    return { method: 'cod', message: 'Cash on Delivery' };
  } else {
    throw new Error('Invalid payment method');
  }
};

// Generic payment verification
export const verifyPayment = async (paymentData) => {
  const { method, paymentIntentId, orderId, paymentId, signature } = paymentData;

  if (method === 'stripe') {
    return await verifyStripePayment(paymentIntentId);
  } else if (method === 'razorpay') {
    return verifyRazorpayPayment(orderId, paymentId, signature);
  } else if (method === 'cod') {
    return true;
  }

  return false;
};

export default {
  createPaymentIntent,
  verifyPayment,
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
  verifyStripePayment,
};
