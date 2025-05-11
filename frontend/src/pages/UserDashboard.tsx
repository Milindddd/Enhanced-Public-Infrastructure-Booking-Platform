import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { format, isAfter, isBefore, addHours } from "date-fns";
import { Booking } from "../types";

// Mock data - Replace with API call
const mockBookings: Booking[] = [
  {
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
  },
  {
    id: "124",
    facilityId: "2",
    userId: "user1",
    date: "2024-03-25",
    startTime: "10:00",
    endTime: "12:00",
    totalAmount: 1000,
    status: "PENDING",
    paymentStatus: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const confirmCancellation = () => {
    // TODO: Implement cancellation logic
    console.log("Cancelling booking:", selectedBooking?.id);
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
    const now = new Date();
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilBooking >= 24 && booking.status === "CONFIRMED";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{format(new Date(booking.date), "PPP")}</TableCell>
                <TableCell>
                  {booking.startTime} - {booking.endTime}
                </TableCell>
                <TableCell>₹{booking.totalAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.paymentStatus}
                    color={getStatusColor(booking.paymentStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {canCancelBooking(booking) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? You will receive a
            full refund if cancelled 24 hours before the booking time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No, Keep Booking</Button>
          <Button
            onClick={confirmCancellation}
            color="error"
            variant="contained"
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;
