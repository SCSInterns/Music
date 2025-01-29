import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const GmailCred = () => {
  const [mail, setmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pwd, setpwd] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const sendOtp = async () => {
    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/send-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: mail }),
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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/verify-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: mail, otp }),
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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/addgooglecreds";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        mail: mail,
        password: pwd,
      }),
    });

    if (response.ok) {
      setmail("");
      setpwd("");
      setOtp("");
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
        <TextField
          label="Mail"
          name="Mail"
          value={mail}
          variant="outlined"
          onChange={(e) => setmail(e.target.value)}
          fullWidth
          required
          disabled={otpSent}
        />
        {!otpSent && (
          <Button
            onClick={sendOtp}
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
          >
            Send OTP
          </Button>
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
          <TextField
            label="App Password"
            name="App Password"
            variant="outlined"
            value={pwd}
            onChange={(e) => setpwd(e.target.value)}
            fullWidth
            required
            sx={{ marginTop: "20px" }}
          />
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

export default GmailCred;
