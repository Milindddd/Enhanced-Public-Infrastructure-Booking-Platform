import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { Booking } from "../types";

// Mock data - Replace with API call
const mockBooking: Booking = {
  id: "123",
  facilityId: "1",
  userId: "user1",
  date: "2024-03-20",
  startTime: "14:00",
  endTime: "16:00",
  totalAmount: 2000,
  status: "CONFIRMED",
  paymentStatus: "COMPLETED",
  createdAt: new Date().toISOString(),
};

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download
    console.log("Downloading receipt...");
  };

  const handleViewBookings = () => {
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="subtitle1" color="success.main">
            Your booking has been successfully confirmed
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Booking ID
                    </TableCell>
                    <TableCell>{mockBooking.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Date
                    </TableCell>
                    <TableCell>
                      {format(new Date(mockBooking.date), "PPP")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Time
                    </TableCell>
                    <TableCell>
                      {mockBooking.startTime} - {mockBooking.endTime}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Status
                    </TableCell>
                    <TableCell>{mockBooking.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Payment Status
                    </TableCell>
                    <TableCell>{mockBooking.paymentStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Total Amount
                    </TableCell>
                    <TableCell>₹{mockBooking.totalAmount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="outlined" onClick={handleDownloadReceipt}>
                Download Receipt
              </Button>
              <Button variant="contained" onClick={handleViewBookings}>
                View My Bookings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;
