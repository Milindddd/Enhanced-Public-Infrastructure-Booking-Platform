import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

interface Facility {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  hourlyRate: number;
  capacity: number;
  imageUrl: string;
}

const FacilityBooking: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    fetchFacility();
  }, [facilityId]);

  const fetchFacility = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/facilities/${facilityId}`
      );
      setFacility(response.data);
    } catch (error) {
      setError("Failed to fetch facility details");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!startTime || !endTime) {
      setError("Please select both start and end times");
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/bookings/check-availability",
        {
          params: {
            facilityId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          },
        }
      );
      setIsAvailable(response.data);
      if (!response.data) {
        setError("Selected time slot is not available");
      } else {
        setError(null);
      }
    } catch (error) {
      setError("Failed to check availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBooking = async () => {
    if (!startTime || !endTime || !isAvailable) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/bookings", {
        facilityId,
        userId: "user123", // TODO: Replace with actual user ID from auth
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalAmount: calculateTotalAmount(),
      });

      navigate(`/booking-confirmation/${response.data.id}`);
    } catch (error) {
      setError("Failed to create booking");
    }
  };

  const calculateTotalAmount = () => {
    if (!facility || !startTime || !endTime) return 0;
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return facility.hourlyRate * hours;
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

  if (!facility) {
    return (
      <Box p={3}>
        <Alert severity="error">Facility not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Book {facility.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {facility.type}
              </Typography>
              <Typography variant="body1" paragraph>
                {facility.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {facility.location}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Capacity: {facility.capacity}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rate: ${facility.hourlyRate}/hour
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Time Slot
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box mb={2}>
                  <DateTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue) => {
                      setStartTime(newValue);
                      setIsAvailable(null);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Box>

                <Box mb={2}>
                  <DateTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newValue) => {
                      setEndTime(newValue);
                      setIsAvailable(null);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Box>
              </LocalizationProvider>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {isAvailable && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Time slot is available!
                </Alert>
              )}

              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={checkAvailability}
                  disabled={!startTime || !endTime || isCheckingAvailability}
                >
                  {isCheckingAvailability ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Check Availability"
                  )}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBooking}
                  disabled={!isAvailable}
                >
                  Book Now
                </Button>
              </Box>

              {startTime && endTime && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Total Amount: ${calculateTotalAmount().toFixed(2)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacilityBooking;
