import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Only initialize Stripe if the API key is provided
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const PaymentContext = createContext({});

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Create subscription checkout
  const createSubscription = async (priceId) => {
    try {
      setLoading(true);
      
      if (!stripePromise) {
        toast.error('Payment system is not configured. Please contact support.');
        return;
      }
      
      const stripe = await stripePromise;
      
      const response = await axios.post('/api/payments/create-subscription', {
        priceId,
        userId: user.id
      });
      
      const { sessionId } = response.data;
      
      const result = await stripe.redirectToCheckout({
        sessionId
      });
      
      if (result.error) {
        toast.error(result.error.message);
      }
      
    } catch (error) {
      toast.error('Failed to create subscription');
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process appointment payment
  const processAppointmentPayment = async (appointmentId, amount) => {
    try {
      setLoading(true);
      
      if (!stripePromise) {
        toast.error('Payment system is not configured. Please contact support.');
        return { success: false };
      }
      
      const stripe = await stripePromise;
      
      const response = await axios.post('/api/payments/appointment-payment', {
        appointmentId,
        amount,
        userId: user.id
      });
      
      const { clientSecret } = response.data;
      
      // Return payment intent for further processing
      return { success: true, clientSecret };
      
    } catch (error) {
      toast.error('Payment processing failed');
      console.error('Payment error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await axios.post('/api/payments/cancel-subscription');
      toast.success('Subscription cancelled successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to cancel subscription');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    createSubscription,
    processAppointmentPayment,
    cancelSubscription
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
