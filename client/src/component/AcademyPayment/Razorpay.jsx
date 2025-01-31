import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const Razorpay = () => {
  const [id, setid] = useState("");
  const [key, setkey] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const token = Token();
  const role = sessionStorage.getItem("role");
  const academyname = sessionStorage.getItem("academyname");

  const sendOtp = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/send-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } else {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/verify-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (response.ok) {
      setOtpVerified(true);
      toast.success("OTP verified successfully.");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/addrazorpaycreds";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        id: id,
        key: key,
      }),
    });

    if (response.ok) {
      setid("");
      setkey("");
      setOtp("");
      setEmail("");
      setOtpSent(false);
      setOtpVerified(false);
      toast.success("Credentials saved successfully.");
    } else {
      toast.error("Failed to save credentials.");
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "auto",
          marginTop: "70px",
          padding: "20px",
        }}
      >
        {!otpSent && (
          <>
            <TextField
              label="Email"
              name="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ marginBottom: "20px" }}
            />
            <Button
              onClick={sendOtp}
              variant="contained"
              color="primary"
              sx={{ marginBottom: "20px" }}
            >
              Send OTP
            </Button>
          </>
        )}

        {otpSent && !otpVerified && (
          <>
            <TextField
              label="OTP"
              name="OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              required
            />
            <Button
              onClick={verifyOtp}
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
            >
              Verify OTP
            </Button>
          </>
        )}

        {otpVerified && (
          <>
            <TextField
              label="RAZORPAY_KEY_ID"
              name="RAZORPAY_KEY_ID"
              variant="outlined"
              value={id}
              onChange={(e) => setid(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="RAZORPAY_SECRET_KEY"
              name="RAZORPAY_SECRET_KEY"
              variant="outlined"
              value={key}
              onChange={(e) => setkey(e.target.value)}
              fullWidth
              required
              sx={{ marginTop: "20px" }}
            />
          </>
        )}
      </Box>

      {otpVerified && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      )}
    </>
  );
};

export default Razorpay;
