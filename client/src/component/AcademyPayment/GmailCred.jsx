import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const GmailCred = () => {
  const [mail, setmail] = useState("");
  const [pwd, setpwd] = useState("");
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handleSubmit = async () => {
    const url = "http://localhost:5000/api/auth/addgooglecreds";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        mail: mail,
        password: pwd,
      }),
    });

    if (response.ok) {
      setmail("");
      setpwd("");
      toast.success("Creds Saved Success");
    } else {
      setmail("");
      setpwd("");
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
          label="Mail"
          name="Mail"
          value={mail}
          variant="outlined"
          onChange={(e) => setmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="App Password"
          name="App Password"
          variant="outlined"
          value={pwd}
          onChange={(e) => setpwd(e.target.value)}
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

export default GmailCred;
