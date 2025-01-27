import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
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
import CloseIcon from "@mui/icons-material/Close";
import PaymentInfoTable from "./PaymentInfoTable";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

export default function FilterMenu() {
  const [paymentdate, setpaymentdate] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchname, setbatchname] = useState([]);
  const [status, setStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const token = Token();
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelectChange = (event) => setSelectedBatch(event.target.value);
  const applyFilters = () => {
    let filtered = [...data];

    if (paymentdate) {
      const filterMonthYear = paymentdate.split("-").reverse().join("-");
      filtered = filtered.filter(
        (item) =>
          item.installmentdate &&
          item.installmentdate.slice(3, 10) === filterMonthYear
      );
    }

    if (selectedBatch) {
      filtered = filtered.filter((item) => item.batchname === selectedBatch);
    }

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    setFilteredData(filtered);
  };

  const handleSubmit = () => {
    applyFilters();
    handleClose();
  };

  const handleReset = () => {
    setpaymentdate("");
    setSelectedBatch("");
    setStatus("");
    setFilteredData(data);
    handleClose();
  };

  const fetchList = async () => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/fetchaccountlist";
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
      setFilteredData(data);
    } else {
      toast.error("Error fetching account list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handlebatchlist = async () => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/ngetbatchesdetails";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dataname = data.map((item) => item.batchname);
        setbatchname(dataname);
      } else {
        toast.error("Error Fetching Batch Names");
      }
    } catch (error) {
      toast.error("Error Fetching Batch Names");
    }
  };

  useEffect(() => {
    handlebatchlist();
  }, []);

  const isOpen = Boolean(anchorEl);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Typography
          sx={{
            color: "#0d1b2a",
            zIndex: 3,
            mr: 1,
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          Filter:
        </Typography>
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
        <IconButton
          onClick={handleClose}
          sx={{
            border: "1px solid #0d1b2a",
            borderRadius: "40%",
            color: "#0d1b2a",
            float: "right",
            marginTop: "5px",
            marginRight: "2px",
          }}
        >
          <CloseIcon sx={{ fontSize: "15px", color: "red" }} />
        </IconButton>

        <Box className="space-y-6 p-6" sx={{ width: "250px", maxWidth: "90%" }}>
          <Typography align="center" gutterBottom>
            Select Month and Year
          </Typography>

          <Box className="flex gap-2 w-full">
            <input
              type="month"
              id="datePicker"
              name="datePicker"
              value={paymentdate}
              onChange={(e) => {
                setpaymentdate(e.target.value);
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                height: "50px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
              }}
            />
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
            {batchname.map((batch, index) => (
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
            <FormControlLabel value="Paid" control={<Radio />} label="Paid" />
            <FormControlLabel value="Pending" control={<Radio />} label="Due" />
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
        <PaymentInfoTable
          records={filteredData}
          fetchList={() => {
            fetchList();
          }}
        />
      </Box>
    </Box>
  );
}
