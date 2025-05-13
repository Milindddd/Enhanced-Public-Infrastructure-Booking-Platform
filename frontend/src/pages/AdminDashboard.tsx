import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";

interface Facility {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  hourlyRate: number;
  capacity: number;
  isActive: boolean;
}

interface Booking {
  id: number;
  facility: {
    id: number;
    name: string;
    type: string;
    location: string;
  };
  userId: string;
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

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [newFacility, setNewFacility] = useState<Partial<Facility>>({
    name: "",
    type: "",
    description: "",
    location: "",
    hourlyRate: 0,
    capacity: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [facilitiesRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/facilities"),
        axios.get("http://localhost:8080/api/bookings"),
      ]);
      setFacilities(facilitiesRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFacilityStatus = async (
    facilityId: number,
    isActive: boolean
  ) => {
    try {
      await axios.patch(`http://localhost:8080/api/facilities/${facilityId}`, {
        isActive,
      });
      fetchData();
    } catch (error) {
      setError("Failed to update facility status");
    }
  };

  const handleBookingStatus = async (bookingId: number, status: string) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/bookings/${bookingId}/status`,
        {
          status,
        }
      );
      fetchData();
    } catch (error) {
      setError("Failed to update booking status");
    }
  };

  const handleAddFacility = () => {
    setSelectedFacility(null);
    setNewFacility({
      name: "",
      type: "",
      description: "",
      location: "",
      hourlyRate: 0,
      capacity: 0,
      isActive: true,
    });
    setOpenDialog(true);
  };

  const handleEditFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setNewFacility(facility);
    setOpenDialog(true);
  };

  const handleSaveFacility = async () => {
    try {
      if (selectedFacility) {
        await axios.put(
          `http://localhost:8080/api/facilities/${selectedFacility.id}`,
          newFacility
        );
      } else {
        await axios.post("http://localhost:8080/api/facilities", newFacility);
      }
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      setError("Failed to save facility");
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
        Admin Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Facilities" />
            <Tab label="Bookings" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFacility}
              sx={{ mb: 2 }}
            >
              Add New Facility
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rate/Hour</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>{facility.name}</TableCell>
                      <TableCell>{facility.type}</TableCell>
                      <TableCell>{facility.location}</TableCell>
                      <TableCell>${facility.hourlyRate}</TableCell>
                      <TableCell>{facility.capacity}</TableCell>
                      <TableCell>
                        <Chip
                          label={facility.isActive ? "Active" : "Inactive"}
                          color={facility.isActive ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEditFacility(facility)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color={facility.isActive ? "error" : "success"}
                          onClick={() =>
                            handleFacilityStatus(
                              facility.id,
                              !facility.isActive
                            )
                          }
                        >
                          {facility.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Facility</TableCell>
                    <TableCell>User</TableCell>
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
                      <TableCell>{booking.userId}</TableCell>
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
                          color={
                            booking.status === "CONFIRMED"
                              ? "success"
                              : booking.status === "PENDING"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() =>
                                handleBookingStatus(booking.id, "CONFIRMED")
                              }
                              sx={{ mr: 1 }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                handleBookingStatus(booking.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFacility ? "Edit Facility" : "Add New Facility"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={newFacility.name}
              onChange={(e) =>
                setNewFacility({ ...newFacility, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Type"
              value={newFacility.type}
              onChange={(e) =>
                setNewFacility({ ...newFacility, type: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newFacility.description}
              onChange={(e) =>
                setNewFacility({ ...newFacility, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              value={newFacility.location}
              onChange={(e) =>
                setNewFacility({ ...newFacility, location: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Hourly Rate"
              type="number"
              value={newFacility.hourlyRate}
              onChange={(e) =>
                setNewFacility({
                  ...newFacility,
                  hourlyRate: parseFloat(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={newFacility.capacity}
              onChange={(e) =>
                setNewFacility({
                  ...newFacility,
                  capacity: parseInt(e.target.value),
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveFacility}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
