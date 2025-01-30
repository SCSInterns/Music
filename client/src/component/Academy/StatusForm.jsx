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

  const sendcredentialsemail = async (
    academyname,
    email,
    role,
    studentname
  ) => {
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/setcredentials";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
        email: email,
        studentname: studentname,
      }),
    });
    console.log(response);
    if (response.ok) {
      toast.success("Credentials setted successfully");
    }
  };

  const handleSubmit = async (status, id) => {
    const url = `https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/updatestatus/${id}`;
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    });

    if (response.ok) {
      if (status === "Accept") {
        await sendcredentialsemail(
          academyname,
          studentData.email,
          "Admin",
          studentData.name
        );
      }
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

          {/* Student Email */}
          <TextField
            fullWidth
            margin="normal"
            label="Student Email"
            value={studentData.email}
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
          <Button
            onClick={() => {
              handleSubmit(selectedStatus, studentData.id);
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
