import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const WarningDialog = ({ open, onClose, onProceed, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Warning</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onProceed} color="primary" autoFocus>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
