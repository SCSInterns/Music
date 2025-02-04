import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const academyname = sessionStorage.getItem("Academy");

  const loginlink = `/${academyname}/login`;

  // Function to handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const url = "http://localhost:5000/api/auth/send-customotp";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          academyname,
        }),
      });

      if (response.status === 200) {
        setOtpSent(true);
        setMsg("OTP sent successfully");
        toast.success("OTP sent successfully");
      } else {
        const errorText = await response.text();
        setMsg(`Error sending OTP: ${errorText}`);
        toast.error(`Error sending OTP: ${errorText}`);
      }
    } catch (error) {
      setMsg("Failed to send OTP.");
      toast.error("Failed to send OTP.");
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);

    const url = "http://localhost:5000/api/auth/verify-otp";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (response.status === 200) {
        setIsOtpVerified(true);
        setMsg("OTP verified successfully");
        toast.success("OTP verified successfully");
      } else {
        const errorText = await response.text();
        setMsg(`Invalid OTP: ${errorText}`);
        toast.error(`Invalid OTP: ${errorText}`);
      }
    } catch (error) {
      setMsg("Failed to verify OTP.");
      toast.error("Failed to verify OTP.");
    }

    setLoading(false);
  };

  const handlePasswordReset = async () => {
    const pwdregex = /^\d{4}$/;

    if (pwdregex.test(newPassword)) {
      if (newPassword === confirmPassword) {
        const url = "http://localhost:5000/api/auth/resetcred";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academyname: academyname,
            email: email,
            role: "Admin",
            password: newPassword,
          }),
        });

        if (response.ok) {
          toast.success("New password updated");
          setNewPassword("");
          setEmail("");
          setConfirmPassword("");
          navigate(loginlink);
        } else {
          toast.error("Password updatation fail");
        }
      } else {
        toast.error("Passwords do not match!");
      }
    } else {
      toast.error("Enter the 4 digit password only ");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div
          className="bg-white shadow-lg rounded-lg p-10"
          style={{ border: "2px solid #0c4b65" }}
        >
          {!otpSent ? (
            <div>
              <h2 className="text-xl font-semibold mb-6">Forgot Password</h2>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSendOtp}
                disabled={!email || loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ marginTop: "20px" }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          ) : !isOtpVerified ? (
            <div>
              <h2 className="text-xl font-semibold mb-6">Enter OTP</h2>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleVerifyOtp}
                disabled={!otp || loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ marginTop: "20px" }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6 ">Reset Password</h2>
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                placeholder="Enter 4 digit pin"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4 mt-4"
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                placeholder="Enter 4 digit pin "
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 mt-4"
                style={{ marginTop: "20px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordReset}
                disabled={!newPassword || !confirmPassword}
                endIcon={<FaCheckCircle />}
                sx={{ marginTop: "20px", padding: "15px" }}
              >
                Reset Password
              </Button>
            </div>
          )}
          <div className="my-10" style={{ alignContent: "center" }}>
            Know your password:
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate(loginlink);
              }}
              sx={{ marginLeft: "20px", bgcolor: "#0c4b65" }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
