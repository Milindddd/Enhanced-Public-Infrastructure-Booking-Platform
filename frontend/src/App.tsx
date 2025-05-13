import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FacilityList from "./components/FacilityList";

// Pages
import Home from "./pages/Home";
import FacilityBooking from "./pages/FacilityBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Components
import Navbar from "./components/Navbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Public Infrastructure Booking
                </Typography>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/facilities">
                  Facilities
                </Button>
              </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                      <Typography variant="h4" gutterBottom>
                        Welcome to Public Infrastructure Booking
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Book community halls, parks, crematoriums, guest houses,
                        and stadiums with ease.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/facilities"
                        size="large"
                      >
                        View Facilities
                      </Button>
                    </Box>
                  }
                />
                <Route path="/facilities" element={<FacilityList />} />
                <Route
                  path="/facilities/:id/book"
                  element={<FacilityBooking />}
                />
                <Route
                  path="/bookings/:bookingId"
                  element={<BookingConfirmation />}
                />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
