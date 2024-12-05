import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const Razorpay = () => {
  const [id, setid] = useState("");
  const [key, setkey] = useState("");
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handleSubmit = async () => {
    const url = "http://localhost:5000/api/auth/addrazorpaycreds";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        id: id,
        key: key,
      }),
    });

    if (response.ok) {
      setid("");
      setkey("");
      toast.success("Creds Saved Success");
    } else {
      setid("");
      setkey("");
      toast.error("Creds Saving Failed ");
    }
  };

  return (
    <>
      <Box
        component="form"
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
          onChange={(e) => setid(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="RAZORPAY_SECRET_KEY"
          name="RAZORPAY_SECRET_KEY"
          variant="outlined"
          onChange={(e) => setkey(e.target.value)}
          fullWidth
          required
          sx={{ marginTop: "20px" }}
        />
      </Box>
      <Button
        onClick={() => {
          handleSubmit();
        }}
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
