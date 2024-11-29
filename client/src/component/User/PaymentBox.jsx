import React from "react";
import { Check, CreditCard } from "lucide-react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

export default function PaymentForm({ data }) {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "24px",
      }}
    >
      <Grid container spacing={4}>
        {/* Left Column - Payment Form */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Continue Your Musical Journey
            </Typography>
            <Typography color="textSecondary">
              It's time to hit the next note! Clear your installment and stay on
              track.
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Card number
              </Typography>
              <Box sx={{ position: "relative" }}>
                <TextField
                  id="card"
                  placeholder="9870 8880 8880 8880"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      >
                        <CreditCard style={{ color: "#9e9e9e" }} />
                      </Box>
                    ),
                    sx: { pl: 5 },
                  }}
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Expiry
                </Typography>
                <TextField id="expiry" placeholder="MM / YY" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  CVC
                </Typography>
                <TextField id="cvc" placeholder="CVC" fullWidth />
              </Grid>
            </Grid>
          </Box>
          <Button variant="contained" size="medium" sx={{ marginTop: "20px" }}>
            Pay now
          </Button>
        </Grid>

        {/* Right Column - Payment Summary */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent sx={{ padding: 3 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  You've to pay.
                </Typography>
                <Typography variant="h3" fontWeight="bold" mt={1}>
                  ₹ {data.dueamount}
                </Typography>
              </Box>

              <Box sx={{ marginTop: 4 }}>
                {[
                  {
                    title: "Student Name : ",
                    text: `${data.studentname}`,
                  },
                  {
                    title: "Student Id : ",
                    text: `${data.studentid}`,
                  },
                  {
                    title: "Course : ",
                    text: `${data.course}`,
                  },
                  {
                    title: "Joining Date : ",
                    text: `${data.installmentdate}`,
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      marginBottom: 3,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#e3f2fd",
                        borderRadius: "50%",
                        padding: "4px",
                      }}
                    >
                      <Check style={{ color: "#2196f3" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography fontWeight="bold">{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary" ml={1}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Box
                  sx={{
                    marginTop: 3,
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    The invoice will be emailed within 2 business days.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
