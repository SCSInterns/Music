import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const PaymentDialog = ({ open, onClose, data }) => {
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const academyid = sessionStorage.getItem("academyid");
  const role = sessionStorage.getItem("role");
  const city = sessionStorage.getItem("city");

  const handleOptionClick = async (option) => {
    console.log(option);
    if (option === "payLater") {
      const url = "http://localhost:5000/api/auth/paylateradvertise";

      const createbooking = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          academyid: academyid,
          advertiseid: data._id,
          academycity: city,
          amount: data.price,
          advertisename: data.name,
        }),
      });
      const result = await createbooking.json();
      const msg = result.message;

      if (createbooking.ok) {
        toast.success(msg);
        onClose(); // Close the dialog
      } else {
        toast.error(msg);
      }
    }

    onClose(); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Payment Option</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please select your preferred payment option:
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOptionClick("payNow")}
        >
          Pay Now
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleOptionClick("payLater")}
        >
          Pay Later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
