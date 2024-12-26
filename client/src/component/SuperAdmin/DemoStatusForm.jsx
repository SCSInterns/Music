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
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };
  const handleSubmit = async (status, id) => {
    const url = `https://music-academy-e32v.onrender.com/api/superadmin/handledemostatus`;
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        demoid: id,
        role: studentData.role,
        status: status,
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
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent dividers>
          {/* Status Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Select Status"
            >
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit(selectedStatus, studentData.demoid);
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
