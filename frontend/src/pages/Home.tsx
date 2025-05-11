import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Facility } from "../types";

// Mock data - Replace with API call
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
  // Add more mock facilities as needed
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityType, setFacilityType] = useState<string>("");

  const handleFacilityTypeChange = (event: SelectChangeEvent) => {
    setFacilityType(event.target.value);
  };

  const filteredFacilities = mockFacilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !facilityType || facility.type === facilityType;
    return matchesSearch && matchesType;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Facilities
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search facilities"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Facility Type</InputLabel>
              <Select
                value={facilityType}
                label="Facility Type"
                onChange={handleFacilityTypeChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="HALL">Community Hall</MenuItem>
                <MenuItem value="PARK">Park</MenuItem>
                <MenuItem value="CREMATORIUM">Crematorium</MenuItem>
                <MenuItem value="GUEST_HOUSE">Guest House</MenuItem>
                <MenuItem value="STADIUM">Stadium</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {filteredFacilities.map((facility) => (
          <Grid item key={facility.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={facility.images[0]}
                alt={facility.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {facility.description}
                </Typography>
                {facility.capacity && (
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {facility.capacity} people
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Price: ₹{facility.pricePerHour}/hour
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/book/${facility.id}`)}
                >
                  Book Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
