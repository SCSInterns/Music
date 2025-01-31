import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Token from "../Token/Token";

export default function CancelSubscriptionForm({ open, handleClose }) {
  const [formData, setFormData] = useState({
    personalname: "",
    email: "",
    mobileNo: "",
    reason: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/send-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
      }),
    });

    if (response.ok) {
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } else {
      const errorText = await response.text();
      toast.error(`Error sending OTP: ${errorText}`);
    }
  };

  const handleVerifyOtp = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/verify-otp";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        otp,
      }),
    });

    if (response.ok) {
      toast.success("OTP verified successfully");
      setIsOtpVerified(true);
    } else {
      toast.error("Invalid OTP");
    }
  };

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const nowdate = getCurrentDate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify OTP before submitting the form.");
      return;
    }

    const url = `https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/cancelsubscription`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname,
        role,
        reason: formData.reason,
        name: formData.personalname,
        email: formData.email,
        mobileno: formData.mobileNo,
        date: nowdate,
      }),
    });

    if (response.ok) {
      toast.success("Your Plan Cancelled");
      navigate("/admin/login");
    } else {
      const data = await response.json();
      const msg = data.msg;
      toast.error(msg);
    }

    setFormData({
      personalname: "",
      email: "",
      mobileNo: "",
      reason: "",
    });

    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              We're sorry to see you go. Please fill out this form to cancel
              your subscription.
            </DialogContentText>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                autoFocus
                margin="dense"
                name="personalname"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.personalname}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="mobileNo"
                label="Mobile Number"
                type="tel"
                fullWidth
                variant="outlined"
                value={formData.mobileNo}
                onChange={handleChange}
                inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                required
              />
              <TextField
                margin="dense"
                name="reason"
                label="Reason for Cancellation"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.reason}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 200 }}
              />

              {otpSent && (
                <>
                  <TextField
                    margin="dense"
                    name="otp"
                    label="Enter OTP"
                    type="text"
                    variant="outlined"
                    value={otp}
                    sx={{ float: "right" }}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "150px",
                        float: "right",
                        bgcolor: "#0d1b2a",
                      }}
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </Button>
                  </div>
                </>
              )}

              {!otpSent && (
                <div>
                  <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    sx={{ width: "150px", float: "right", bgcolor: "#0d1b2a" }}
                  >
                    Send OTP
                  </Button>
                </div>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isOtpVerified}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
