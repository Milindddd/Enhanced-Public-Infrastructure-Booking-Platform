import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { Facility, Booking } from "../types";

// Mock data - Replace with API calls
const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "Community Hall A",
    type: "HALL",
    description: "A spacious community hall perfect for events and gatherings.",
    capacity: 200,
    pricePerHour: 1000,
    availableSlots: [],
    images: ["https://source.unsplash.com/random/800x600/?hall"],
  },
  {
    id: "2",
    name: "Central Park",
    type: "PARK",
    description: "Beautiful park with playground and sports facilities.",
    pricePerHour: 500,
    availableSlots: [],
    images: ["https://source.unsplash.com/random/800x600/?park"],
  },
];

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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddFacility = () => {
    setSelectedFacility(null);
    setOpenDialog(true);
  };

  const handleEditFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFacility(null);
  };

  const handleSaveFacility = () => {
    // TODO: Implement save facility logic
    handleCloseDialog();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Facilities" />
          <Tab label="Bookings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFacility}
            >
              Add New Facility
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Price/Hour</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>{facility.name}</TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{facility.capacity || "N/A"}</TableCell>
                    <TableCell>₹{facility.pricePerHour}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleEditFacility(facility)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Facility</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>
                      {
                        mockFacilities.find((f) => f.id === booking.facilityId)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.date), "PPP")}
                    </TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFacility ? "Edit Facility" : "Add New Facility"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Facility Name"
                defaultValue={selectedFacility?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Facility Type</InputLabel>
                <Select
                  label="Facility Type"
                  defaultValue={selectedFacility?.type || ""}
                >
                  <MenuItem value="HALL">Community Hall</MenuItem>
                  <MenuItem value="PARK">Park</MenuItem>
                  <MenuItem value="CREMATORIUM">Crematorium</MenuItem>
                  <MenuItem value="GUEST_HOUSE">Guest House</MenuItem>
                  <MenuItem value="STADIUM">Stadium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                defaultValue={selectedFacility?.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                defaultValue={selectedFacility?.capacity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Hour"
                type="number"
                defaultValue={selectedFacility?.pricePerHour}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveFacility} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
