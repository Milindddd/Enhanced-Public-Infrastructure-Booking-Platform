import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import PaymentForm from "../components/PaymentForm";

interface Booking {
  id: number;
  facility: {
    id: number;
    name: string;
    type: string;
    location: string;
  };
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
}

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bookings/${bookingId}`
      );
      setBooking(response.data);
    } catch (error) {
      setError("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/bookings/${bookingId}/confirm`,
        {
          paymentId: "mock_payment_" + Date.now(),
        }
      );
      setShowPaymentForm(false);
      fetchBooking();
    } catch (error) {
      setError("Failed to process payment");
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await axios.patch(
          `http://localhost:8080/api/bookings/${bookingId}/cancel`,
          {
            reason: "Cancelled by user",
          }
        );
        setBooking(response.data);
      } catch (error) {
        setError("Failed to cancel booking");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box p={3}>
        <Alert severity="error">Booking not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5">Booking Confirmation</Typography>
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status) as any}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Facility Details
              </Typography>
              <Typography variant="body1">{booking.facility.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Type: {booking.facility.type}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {booking.facility.location}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Booking Details
              </Typography>
              <Typography variant="body2">
                Start Time: {format(new Date(booking.startTime), "PPp")}
              </Typography>
              <Typography variant="body2">
                End Time: {format(new Date(booking.endTime), "PPp")}
              </Typography>
              <Typography variant="body2">
                Total Amount: ${booking.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Booking Date: {format(new Date(booking.createdAt), "PPp")}
              </Typography>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" gap={2} mt={3}>
            {booking.status === "PENDING" && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowPaymentForm(true)}
                >
                  Proceed to Payment
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel Booking
                </Button>
              </>
            )}
            <Button variant="outlined" onClick={() => navigate("/facilities")}>
              Back to Facilities
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <PaymentForm
            bookingId={booking.id}
            amount={booking.totalAmount}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentForm(false)}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default BookingConfirmation;
