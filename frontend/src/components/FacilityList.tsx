import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Chip,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
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
  imageUrl: string;
  contactNumber: string;
  email: string;
}

const FacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Facility>>({});

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/facilities");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/facilities/search?location=${searchLocation}`
      );
      setFacilities(response.data);
    } catch (error) {
      console.error("Error searching facilities:", error);
    }
  };

  const handleOpenDialog = (facility?: Facility) => {
    if (facility) {
      setSelectedFacility(facility);
      setFormData(facility);
    } else {
      setSelectedFacility(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFacility(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedFacility) {
        await axios.put(
          `http://localhost:8080/api/facilities/${selectedFacility.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/facilities", formData);
      }
      handleCloseDialog();
      fetchFacilities();
    } catch (error) {
      console.error("Error saving facility:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await axios.delete(`http://localhost:8080/api/facilities/${id}`);
        fetchFacilities();
      } catch (error) {
        console.error("Error deleting facility:", error);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/facilities/${id}/toggle-status`
      );
      fetchFacilities();
    } catch (error) {
      console.error("Error toggling facility status:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Facilities</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Facility
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Search by Location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Grid container spacing={3}>
        {facilities.map((facility) => (
          <Grid item xs={12} sm={6} md={4} key={facility.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={facility.imageUrl || "https://via.placeholder.com/140"}
                alt={facility.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {facility.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {facility.type}
                </Typography>
                <Typography variant="body2" paragraph>
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
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={facility.isActive ? "Active" : "Inactive"}
                    color={facility.isActive ? "success" : "default"}
                    onClick={() => handleToggleStatus(facility.id)}
                  />
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(facility)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(facility.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedFacility ? "Edit Facility" : "Add Facility"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Name"
              value={formData.name || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="type"
              label="Type"
              value={formData.type || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description || ""}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              name="location"
              label="Location"
              value={formData.location || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="hourlyRate"
              label="Hourly Rate"
              type="number"
              value={formData.hourlyRate || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="capacity"
              label="Capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="contactNumber"
              label="Contact Number"
              value={formData.contactNumber || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedFacility ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilityList;
