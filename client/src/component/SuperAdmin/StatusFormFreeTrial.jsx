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

function StatusFormFreeTrial({ open, handleClose, id, name }) {
  console.log(name);
  console.log(id);
  const [password, setPassword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSubmit = () => {
    console.log("Password:", password);
    console.log("Status:", selectedStatus);

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

        {/* Password Input */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
