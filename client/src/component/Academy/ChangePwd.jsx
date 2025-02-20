import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

export default function ChangePasswordModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]).{8,}$/;
    if (!regex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/changeadmincreds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${sessionStorage.getItem("accesstoken")}`,
          },
          body: JSON.stringify({
            email: formData.email,
            oldpassword: formData.currentPassword,
            password: formData.newPassword,
            role: `${sessionStorage.getItem("role")}`,
            academyname: `${sessionStorage.getItem("academyname")}`,
          }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        handleClose();
      } else {
        const data = await response.json();
        const msg = data.msg;
        toast.error(msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Change Password
        </Typography>

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.currentPassword}
          onChange={handleChange}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
        />

        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.newPassword}
          onChange={handleChange}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Change Password
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
