import * as React from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState } from "react";

function AcademyDashboard() {
  const academyname = sessionStorage.getItem("academyname");

  const datatypes = [
    {
      value: "String",
      label: "String",
    },
    {
      value: "Number",
      label: "Number",
    },
    {
      value: "Object",
      label: "Selection Box",
    },
    {
      value: "Object",
      label: "Radio Button",
    },
    {
      value: "Email",
      label: "Email Id",
    },
  ];

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  const [entries, setEntries] = useState([]);

  const handleAddition = () => {
    setEntries([...entries, { LabelName: label, ValueType: value }]);

    setLabel("");
    setValue("");
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#283255",
          fontWeight: "bold",
          color: "white",
          padding: "25px",
          borderBottom: "2px solid black",
        }}
      >
        <h1 style={{ fontSize: "20px" }}>Welcome {academyname} Academy</h1>

        <p style={{ fontSize: "15px", marginTop: "10px" }}>Admin Dashboard</p>

        <h4></h4>
      </div>

      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            height: "100%",
            width: "20%",
            borderRight: "2px solid black",
            backgroundColor: "#283255",
            color: "white",
          }}
        >
          <h4 style={{ margin: "10px" }}> Registration form </h4>
          <Divider />
        </div>
        <div
          style={{
            height: "100%",
            width: "80%",
            backgroundColor: "#f3f3f5",
          }}
        >
          <p style={{ padding: "10px", fontFamily: "sans-serif" }}>
            Create Academy Registration Form Here
          </p>

          <Divider />
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography> Enter Label Name Here : </Typography>
              <TextField
                id="outlined-basic"
                label="Label"
                variant="outlined"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{
                  width: "50%",
                }}
              />
            </Box>
            <Divider sx={{ marginTop: "20px" }} />

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography> Enter Label Type Here : </Typography>
              <TextField
                id="outlined-select-currency-native"
                select
                value={value}
                SelectProps={{
                  native: true,
                }}
                style={{
                  width: "50%",
                }}
                helperText="Please select your data type for defined label here "
                onChange={(e) => setValue(e.target.value)}
              >
                <option selected>Select Option</option>
                {datatypes.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <Divider sx={{ marginTop: "10px" }} />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#283255",
                margin: "30px",
                float: "right",
              }}
              onClick={handleAddition}
            >
              {" "}
              Add{" "}
            </Button>
          </div>

          {/* Table  */}
          <div style={{ padding: "10px" }}>
            <Typography variant="h6" gutterBottom>
              Added Data
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Label Name</TableCell>
                    <TableCell>Value Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.LabelName}</TableCell>
                      <TableCell>{entry.ValueType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default AcademyDashboard;
