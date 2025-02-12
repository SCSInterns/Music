import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  DialogActions,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const TicketBookingDialog = ({ open, onClose, plans }) => {
  const [selectedTickets, setSelectedTickets] = useState({});

  console.log(selectedTickets);

  const totalAmount = Object.entries(selectedTickets).reduce(
    (acc, [planName, count]) => {
      const plan = plans.find((p) => p.planName === planName);
      return acc + (plan ? plan.pricePerSeat * count : 0);
    },
    0
  );

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
      <div className="flex justify-between items-center">
        <DialogTitle>Select Tickets</DialogTitle>
        <DialogActions className="mr-4 !p-0 !w-fit">
          <CloseIcon
            onClick={onClose}
            className="hover:text-white hover:bg-red-500 !border !size-7 p-1 rounded-lg border-red-600 text-red-600 cursor-pointer"
            fontSize="small"
          />
        </DialogActions>
      </div>
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
      </DialogContent>
      <div className="flex  items-center justify-between px-4 py-2  border border-t-1 border-black">
        <div className="flex space-x-2 items-center">
          <p className="semibold text-xl text-blue-500">Total :</p>

          <span>
            <span>₹ </span>
            <span className="text-xl bold">{totalAmount}</span>
          </span>
        </div>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, float: "right" }}
          onClick={onClose}
        >
          Proceed to Checkout
        </Button>
      </div>
    </Dialog>
  );
};

export default TicketBookingDialog;
