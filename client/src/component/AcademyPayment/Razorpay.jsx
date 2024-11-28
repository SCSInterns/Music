import React from "react";
import { Box, TextField, Button } from "@mui/material";

const Razorpay = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      field1: formData.get("field1"),
      field2: formData.get("field2"),
    };
    console.log("Form Data:", data);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "auto",
          marginTop: "70px",
          padding: "20px",
        }}
      >
        <TextField
          label="RAZORPAY_KEY_ID"
          name="RAZORPAY_KEY_ID"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="RAZORPAY_SECRET_KEY"
          name="RAZORPAY_SECRET_KEY"
          variant="outlined"
          fullWidth
          required
          sx={{ marginTop: "20px" }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
      >
        Submit
      </Button>
    </>
  );
};

export default Razorpay;
