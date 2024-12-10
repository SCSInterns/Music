import { useState } from "react";
import { Button, Grid, TextField, Typography, Box, Paper } from "@mui/material";
import Image from "../../../static/Images/SalesSvg.svg";

export default function ScheduleDemo() {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    restaurantName: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  function validateForm() {
    const newErrors = {};
    if (!formValues.name) {
      newErrors.name = "Name is required";
    } else if (formValues.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formValues.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formValues.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formValues.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.city) {
      newErrors.city = "City is required";
    } else if (formValues.city.length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    if (!formValues.restaurantName) {
      newErrors.restaurantName = "Restaurant name is required";
    } else if (formValues.restaurantName.length < 2) {
      newErrors.restaurantName =
        "Restaurant name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
      console.log(formValues);
      // Add further submission logic here
    }
  }

  return (
    <Box className="container mx-auto px-4 py-16">
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "2rem" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Schedule a free demo
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Get in touch with our team to clarify your queries
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone number"
                    variant="outlined"
                    margin="normal"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    variant="outlined"
                    margin="normal"
                    name="city"
                    value={formValues.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                fullWidth
                label="Academy Name"
                variant="outlined"
                margin="normal"
                name="academyName"
                value={formValues.restaurantName}
                onChange={handleChange}
                error={!!errors.restaurantName}
                helperText={errors.restaurantName}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#0d1b2a",
                  ":hover": { backgroundColor: "#ffff", color: "#0d1b2a" },
                  marginTop: "1rem",
                }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} className="hidden lg:block relative">
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              zIndex: -1,
            }}
          />
          <Box
            component="img"
            src={Image}
            alt="Customer service illustration"
            sx={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              height: "auto",
              marginLeft: "30px",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
