import { useState } from "react";
import { Button, Grid, TextField, Typography, Box, Paper } from "@mui/material";
import Image from "../../../static/Images/SalesSvg.svg";
import { toast } from "react-toastify";

export default function ScheduleDemo() {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    academyName: "",
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

    if (!formValues.academyName) {
      newErrors.academyName = "Academy name is required";
    } else if (formValues.academyName.length < 2) {
      newErrors.academyName = "Academy name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(formValues);
      const url = "http://localhost:5000/api/superadmin/savedemoinquiry";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          academyname: formValues.academyName,
          phoneno: formValues.phone,
          city: formValues.city,
          email: formValues.email,
        }),
      });

      const data = await response.json();
      const message = data.msg;

      if (response.ok) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      setFormValues({
        name: "",
        phone: "",
        email: "",
        city: "",
        academyName: "",
      });
    }
  };

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
                value={formValues.academyName}
                onChange={handleChange}
                error={!!errors.academyName}
                helperText={errors.academyName}
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
