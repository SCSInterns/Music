import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const TicketBookingDialog = ({ open, onClose, plans }) => {
  const [selectedTickets, setSelectedTickets] = useState({});

  const handleAddTicket = (planName) => {
    setSelectedTickets((prev) => {
      const count = prev[planName] || 0;
      return count < 10 ? { ...prev, [planName]: count + 1 } : prev;
    });
  };

  const handleRemoveTicket = (planName) => {
    setSelectedTickets((prev) => {
      const count = prev[planName] || 0;
      if (count > 0) {
        const updatedTickets = { ...prev, [planName]: count - 1 };
        if (updatedTickets[planName] === 0) delete updatedTickets[planName];
        return updatedTickets;
      }
      return prev;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Select Tickets</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          You can add up to 10 tickets only
        </Typography>
        {plans.map((plan) => (
          <Box
            key={plan.planName}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              my: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box>
              <Typography variant="h6">{plan.planName}</Typography>
              <Typography variant="body1" color="primary">
                ₹{plan.pricePerSeat}{" "}
                {/* <span style={{ color: "red" }}> | Fast Filling</span> */}
              </Typography>
              {/* <Typography
                variant="body2"
                color="error"
                sx={{ cursor: "pointer" }}
              >
                Know more ↓
              </Typography> */}
            </Box>
            <Box display="flex" alignItems="center">
              {selectedTickets[plan.planName] > 0 && (
                <IconButton
                  onClick={() => handleRemoveTicket(plan.planName)}
                  sx={{ border: "1px solid red", borderRadius: "40%" }}
                >
                  <RemoveIcon color="error" sx={{ fontSize: 15 }} />
                </IconButton>
              )}
              <Typography variant="h6" mx={1}>
                {selectedTickets[plan.planName] || 0}
              </Typography>
              <IconButton
                onClick={() => handleAddTicket(plan.planName)}
                sx={{ border: "1px solid blue", borderRadius: "40%" }}
              >
                <AddIcon color="primary" sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, float: "right" }}
          onClick={onClose}
        >
          Proceed to Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TicketBookingDialog;
