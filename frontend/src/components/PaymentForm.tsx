import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("your_publishable_key");

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent: React.FC<{
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ bookingId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setError(submitError.message || "An error occurred");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            Amount to pay: ${amount.toFixed(2)}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <PaymentElement />

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!stripe || processing}
              fullWidth
            >
              {processing ? <CircularProgress size={24} /> : "Pay Now"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onCancel}
              disabled={processing}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/payments/create-intent/${bookingId}`
        );
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError("Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [bookingId]);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!clientSecret) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <PaymentFormContent
        bookingId={bookingId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default PaymentForm;
