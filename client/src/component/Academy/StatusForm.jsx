import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const StatusFormModal = ({ open, onClose, studentData }) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Selected Status:", selectedStatus);

    const url = "http://localhost:5000/api/auth/updatestatus";
    const token = Token();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentData.id,
        status: selectedStatus,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.msg || "An error occurred");
    } else {
      toast.success("Status updated successfully");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update Student Status</DialogTitle>
      <DialogContent dividers>
        {/* Student Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Student Name"
          value={studentData.name}
          disabled
        />

        {/* Course */}
        <TextField
          fullWidth
          margin="normal"
          label="Course"
          value={studentData.course}
          disabled
        />

        {/* Status Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Select Status"
          >
            <MenuItem value="Accept">Accept</MenuItem>
            <MenuItem value="Reject">Reject</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusFormModal;
