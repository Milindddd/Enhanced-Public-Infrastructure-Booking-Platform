import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/bookings/user/user123"
      ); // TODO: Replace with actual user ID
      setBookings(response.data);
    } catch (error) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const handlePayment = async (bookingId: number) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/bookings/${bookingId}/confirm`,
        {
          paymentId: "mock_payment_" + Date.now(),
        }
      );
      fetchUserBookings();
    } catch (error) {
      setError("Failed to process payment");
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.patch(
          `http://localhost:8080/api/bookings/${bookingId}/cancel`,
          {
            reason: "Cancelled by user",
          }
        );
        fetchUserBookings();
      } catch (error) {
        setError("Failed to cancel booking");
      }
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="My Bookings" />
            <Tab label="Profile" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Facility</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.facility.name}</TableCell>
                      <TableCell>
                        {format(new Date(booking.startTime), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.startTime), "HH:mm")} -{" "}
                        {format(new Date(booking.endTime), "HH:mm")}
                      </TableCell>
                      <TableCell>${booking.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handlePayment(booking.id)}
                              sx={{ mr: 1 }}
                            >
                              Pay
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancel(booking.id)}
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Profile Information
                    </Typography>
                    <Typography variant="body1">Name: John Doe</Typography>
                    <Typography variant="body1">
                      Email: john.doe@example.com
                    </Typography>
                    <Typography variant="body1">
                      Phone: +1 234 567 8900
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Methods
                    </Typography>
                    <Typography variant="body1">
                      No payment methods added
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
