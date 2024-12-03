import React, { useState } from "react";
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
import Token from "../Token/Token";
import Loader from "../Loader/Loader";

export default function PaymentForm({ data }) {
  console.log(data);

  const [orderid, setorderid] = useState("");
  const [loading, setloading] = useState(false);

  const generateorder = async () => {
    const url = "http://localhost:5000/api/auth/createrazorpayorder";
    setloading(true);
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentid: data.studentid,
        academyname: data.academyname,
        amount: 1,
      }),
    });

    if (response.ok) {
      setTimeout(() => {
        setloading(false);
        setorderid(response.orderid);
      }, 2000);
    }
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <>
            <Loader />
          </>
        </div>
      )}

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
                It's time to hit the next note! Clear your installment and stay
                on track.
              </Typography>
            </Box>

            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="medium"
                sx={{ marginTop: "100px" }}
                onClick={() => {
                  generateorder();
                }}
              >
                Proceed For Payment
              </Button>
            </Box>
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
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          ml={1}
                        >
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
                      padding: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Fees Reciept will be emailed within 2 business days.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
