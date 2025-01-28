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

const StatusFormModal = ({ open, onClose, studentData, onstatusChange }) => {
  console.log(studentData);
  const [selectedStatus, setSelectedStatus] = useState("");
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();

  console.log(studentData);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  const handleSubmit = async (id, status, date) => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/verifymanualpayment";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
        studentId: id,
        status: status,
        paymentdate: date,
      }),
    });

    if (response.ok) {
      toast.success("Status updated successfully");
      onClose();
      onstatusChange();
    } else {
      toast.error("Status updation failed ");
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Update Payment Status</DialogTitle>
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

          {/* Payment Date  */}
          <TextField
            fullWidth
            margin="normal"
            label="Payment Date"
            value={studentData.paymentdate}
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
          <Button
            onClick={() => {
              handleSubmit(
                studentData.id,
                selectedStatus,
                studentData.paymentdate
              );
            }}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StatusFormModal;
