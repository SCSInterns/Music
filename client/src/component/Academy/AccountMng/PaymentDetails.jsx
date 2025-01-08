import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Button,
  IconButton,
  Popover,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PaymentInfoTable from "./PaymentInfoTable";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

export default function FilterMenu() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [status, setStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState([]);
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelectChange = (event) => setSelectedBatch(event.target.value);

  const handleSubmit = () => {
    console.log("Filters Applied:", {
      month: selectedMonth,
      year: selectedYear,
      batch: selectedBatch,
      status,
    });
    handleClose();
  };

  const handleReset = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedBatch("");
    setStatus("");
    handleClose();
  };

  const fetchList = async () => {
    const url = "http://localhost:5000/api/auth/fetchaccountlist";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setData(data);
    } else {
      toast.error("Error fetching account list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const isOpen = Boolean(anchorEl);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <IconButton
          onClick={handleOpen}
          sx={{
            border: "1px solid #0d1b2a",
            borderRadius: "40%",
            color: "#0d1b2a",
          }}
        >
          <FilterAltIcon />
        </IconButton>
      </Box>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box className="space-y-6 p-6" sx={{ width: "250px", maxWidth: "90%" }}>
          <Typography align="center" gutterBottom>
            Select Month and Year
          </Typography>

          <Box className="flex gap-2 w-full">
            <FormControl fullWidth>
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Month"
                fullWidth
              >
                {months.map((month, index) => (
                  <MenuItem
                    key={month}
                    value={(index + 1).toString().padStart(2, "0")}
                  >
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Year"
                fullWidth
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Typography align="center" gutterBottom>
            Filter Acc To Batch
          </Typography>
          <TextField
            select
            fullWidth
            label="Select Batch"
            value={selectedBatch}
            onChange={handleSelectChange}
            sx={{ flex: 1, mt: 1 }}
          >
            <MenuItem value="">All Batches</MenuItem>
            {["Batch A", "Batch B", "Batch C"].map((batch, index) => (
              <MenuItem key={index} value={batch}>
                {batch}
              </MenuItem>
            ))}
          </TextField>

          <Typography align="center" gutterBottom>
            Filter Acc To Status
          </Typography>
          <RadioGroup
            row
            aria-label="status"
            name="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <FormControlLabel value="paid" control={<Radio />} label="Paid" />
            <FormControlLabel value="due" control={<Radio />} label="Due" />
          </RadioGroup>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Box>
      </Popover>

      <Box mt={3}>
        <PaymentInfoTable records={data} />
      </Box>
    </Box>
  );
}
