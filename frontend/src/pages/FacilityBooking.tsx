import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { addHours, format, isAfter, isBefore, parseISO } from "date-fns";
import { Facility } from "../types";

// Mock data - Replace with API call
const mockFacility: Facility = {
  id: "1",
  name: "Community Hall A",
  type: "HALL",
  description: "A spacious community hall perfect for events and gatherings.",
  capacity: 200,
  pricePerHour: 1000,
  availableSlots: [],
  images: ["https://source.unsplash.com/random/800x600/?hall"],
};

const steps = ["Select Date & Time", "Review & Confirm", "Payment"];

const FacilityBooking: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedDate || !startTime) {
        setError("Please select both date and time");
        return;
      }
      if (duration < 1 || duration > 5) {
        setError("Duration must be between 1 and 5 hours");
        return;
      }
      setError("");
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateTotalAmount = () => {
    if (!mockFacility) return 0;
    return mockFacility.pricePerHour * duration;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={new Date()}
                maxDate={addHours(new Date(), 30 * 24)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Duration (hours)</InputLabel>
                <Select
                  value={duration}
                  label="Duration (hours)"
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((hours) => (
                    <MenuItem key={hours} value={hours}>
                      {hours} {hours === 1 ? "hour" : "hours"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Facility: {mockFacility.name}</Typography>
                <Typography>
                  Date: {selectedDate && format(selectedDate, "PPP")}
                </Typography>
                <Typography>
                  Time: {startTime && format(startTime, "p")}
                </Typography>
                <Typography>
                  Duration: {duration} {duration === 1 ? "hour" : "hours"}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Total Amount: ₹{calculateTotalAmount()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Typography>Amount to Pay: ₹{calculateTotalAmount()}</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                // TODO: Implement payment integration
                navigate("/booking-confirmation/123");
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book {mockFacility.name}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep !== steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 2 ? "Review" : "Next"}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FacilityBooking;
