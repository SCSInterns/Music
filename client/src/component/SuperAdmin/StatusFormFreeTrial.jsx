import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function StatusFormFreeTrial({ open, handleClose, id, name, onstatuschange }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const role = sessionStorage.getItem("role");

  const token = Token();

  const handleSubmit = async () => {
    console.log("Status:", selectedStatus);

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/freetrialsubmission";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyid: id,
        status: selectedStatus,
      }),
    });

    if (response.ok) {
      toast.success("Status Updated");
    } else {
      toast.error("Status Updation Failed");
    }
    onstatuschange();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent dividers>
        {/* Username Input */}
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          value={name}
          inputProps={{ readonly: true }}
        />

        {/* Status Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StatusFormFreeTrial;
