import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const facilities = [
    {
      id: 1,
      name: "Community Hall",
      description: "Perfect for social gatherings and events",
      image: "/images/community-hall.jpg",
    },
    {
      id: 2,
      name: "Park",
      description: "Beautiful outdoor space for recreation",
      image: "/images/park.jpg",
    },
    {
      id: 3,
      name: "Stadium",
      description: "Sports and large-scale events venue",
      image: "/images/stadium.jpg",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Public Infrastructure Booking
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        color="text.secondary"
      >
        Book public facilities with ease
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {facilities.map((facility) => (
          <Grid item xs={12} sm={6} md={4} key={facility.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={facility.image}
                alt={facility.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {facility.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {facility.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/facilities/${facility.id}`)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
