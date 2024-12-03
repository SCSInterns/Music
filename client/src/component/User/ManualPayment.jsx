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
import { toast } from "react-toastify";

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
  console.log(data);
  const [link, setLink] = useState("");
  const [paymentData, setPaymentData] = useState({
    studentid: data?.studentid || "",
    academyname: data?.academyname || "",
    course: data?.course || "",
    amount: "",
    studentname: data?.studentname || "",
    paymentmode: "Online (Manual)",
    enrollmentDate: data?.installmentdate || "",
    studentemail: data?.studentemail || "",
    paymentDate: "",
    TransactionId: "",
  });
  const academyname = sessionStorage.getItem("Academy");

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitPayment = async () => {
    if (paymentData.amount < 0) {
      toast.error("Payment Amount Must Be Positive");
      return;
    }

    if (paymentData.amount < data?.dueamount) {
      toast.error(
        "Due Amount is More . Pls pay balance Amount and Re-Submit Entry "
      );
      return;
    }

    const url = "http://localhost:5000/api/auth/submitmanualpayment";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    if (response.ok) {
      setPaymentData({
        paymentDate: "",
        TransactionId: "",
        amount: "",
      });
      toast.success("Payment Submitted Successfully ");
    } else {
      toast.error("Payment Submission Failed ");
    }
  };

  const fetchQR = async () => {
    const url = "http://localhost:5000/api/auth/getqr";

    try {
      const token = Token();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ academyname }),
      });

      if (response.ok) {
        const data = await response.json();
        setLink(data);
      } else {
        console.error("Failed to fetch QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code", error);
    }
  };

  useEffect(() => {
    if (academyname) fetchQR();
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
                    alt="Contact your academy"
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    You have to pay:
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>
                    ₹ {data?.dueamount || "0.00"}
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

                <Grid container spacing={3} sx={{ marginTop: "20px" }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      variant="outlined"
                      required
                      value={paymentData.TransactionId}
                      onChange={(e) =>
                        handleInputChange("TransactionId", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount Paid"
                      variant="outlined"
                      value={paymentData.amount}
                      required
                      type="number"
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Date"
                      variant="outlined"
                      required
                      value={
                        paymentData.paymentDate
                          ? paymentData.paymentDate
                              .split("-")
                              .reverse()
                              .join("-")
                          : ""
                      }
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        const formattedDate = e.target.value;
                        const reversedDate = formattedDate
                          .split("-")
                          .reverse()
                          .join("-");
                        setPaymentData({
                          ...paymentData,
                          paymentDate: reversedDate,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={submitPayment}
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

                    <Box
                      sx={{
                        marginTop: 3,
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: 2,
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        Fee receipt will be emailed within 2 business days.
                      </Typography>
                    </Box>
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
