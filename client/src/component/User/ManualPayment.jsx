import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Grid,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Token from "../Token/Token";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff",
      paper: "#f9f9f9",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
});

export default function QRPaymentPage({ data }) {
  const [link, setlink] = useState("");
  const academyname = sessionStorage.getItem("Academy");

  const fetchqr = async () => {
    const url = "http://localhost:5000/api/auth/getqr";

    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setlink(data);
    }
  };

  useEffect(() => {
    fetchqr();
  }, [academyname]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          bgcolor: "background.paper",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "background.default",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* QR Code Container */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                  }}
                >
                  <img
                    src={link}
                    alt="Contact your academy "
                    style={{
                      width: "200px",
                      height: "200px",
                      marginBottom: "24px",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Scan QR code to make payment
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount Paid"
                      variant="outlined"
                      required
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Date"
                      variant="outlined"
                      required
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 2,
                        bgcolor: "#1976d2",
                        color: "#ffffff",
                        "&:hover": {
                          bgcolor: "#115293",
                        },
                      }}
                    >
                      Submit Payment Details
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
