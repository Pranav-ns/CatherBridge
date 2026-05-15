import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';
import api from '../services/api';
import './SubscribeModal.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ onSuccess, onCancel, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <PaymentElement id="payment-element" />
      {message && <div className="modal-status error" style={{ marginTop: '1rem' }}>{message}</div>}
      <button disabled={isLoading || !stripe || !elements} className="btn btn-primary w-full" style={{ marginTop: '1.5rem' }}>
        {isLoading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
      <button type="button" onClick={onCancel} className="btn btn-secondary w-full" style={{ marginTop: '0.5rem', background: 'transparent', color: '#666', border: 'none' }}>
        Cancel
      </button>
    </form>
  );
};

const CheckoutModal = ({ caterer, planDetails, onComplete, onClose }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(true);
  
  // Calculate a dummy amount based on plan (in cents)
  const basePrice = planDetails.plan === 'daily' ? 1500 : planDetails.plan === 'weekly' ? 7000 : 25000;
  const amount = basePrice * planDetails.mealsPerDay;

  useEffect(() => {
    api.post('/payments/create-payment-intent', { amount })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        setLoadingSecret(false);
      })
      .catch((err) => {
        console.error('Failed to init payment', err);
        setLoadingSecret(false);
      });
  }, [amount]);

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 1001 }}>
      <div className="subscribe-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="subscribe-header">
          <div>
            <h2>Complete Payment</h2>
            <p className="subscribe-caterer">{caterer.serviceName}</p>
          </div>
        </div>

        {loadingSecret ? (
          <p style={{ textAlign: 'center', padding: '2rem 0' }}>Loading secure checkout...</p>
        ) : clientSecret ? (
          <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
            <CheckoutForm onSuccess={onComplete} onCancel={onClose} amount={amount} />
          </Elements>
        ) : (
          <div className="modal-status error">Failed to load payment system. Ensure Stripe API keys are set.</div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
