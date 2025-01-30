import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import Token from "../../Token/Token";

function AccountPaymentBox({ record, onChange, close }) {
  const [installmentDate, setInstallmentDate] = useState(
    record.installmentdate
  );
  const [dateOptions, setDateOptions] = useState([]);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentamount, setpaymentamount] = useState(record.fees);
  const [paymentdate, setpaymentdate] = useState("");
  const token = Token();
  const role = sessionStorage.getItem("role");

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const handlePaymentAmountChange = (event) => {
    setpaymentamount(event.target.value);
  };

  const generateDateOptions = (installmentDate, totalAmountPaid, fees) => {
    const options = [];

    const [day, month, year] = installmentDate.split("-").map(Number);
    const initialDate = new Date(year, month - 1, day);

    if (isNaN(initialDate.getTime())) {
      console.error("Invalid installment date format. Use DD-MM-YYYY.");
      return options;
    }

    const noOfMonthsToBeSkipped = Math.floor(totalAmountPaid / fees);

    const lastPayDate = new Date(initialDate);
    lastPayDate.setMonth(initialDate.getMonth() + noOfMonthsToBeSkipped - 1);

    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(lastPayDate);
      futureDate.setMonth(lastPayDate.getMonth() + i);

      if (futureDate.getDate() !== day) {
        futureDate.setDate(0);
      }

      const formattedDate = futureDate
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");

      options.push(formattedDate);
    }

    return options;
  };

  useEffect(() => {
    const dateOptions1 = generateDateOptions(
      installmentDate,
      record.totalamountcollected,
      record.fees
    );
    setDateOptions(dateOptions1);
  }, [installmentDate]);

  const formatToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    if (paymentdate === "") {
      setpaymentdate(dateOptions[0]);
    }
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/addadvanceamount";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        studentid: record?.studentid,
        paymentmode: paymentMode,
        paymentdate: paymentdate,
        amount: paymentamount,
      }),
    });
    if (response.ok) {
      toast.success("Advance Payment Added Successfully");
      onChange();
    } else {
      toast.error("Error fetching account list");
    }
  };

  return (
    <>
      <IconButton
        onClick={() => {
          close();
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          border: "1px solid red",
          borderRadius: "40%",
          color: "red",
        }}
      >
        <CloseIcon sx={{ fontSize: "15px" }} />
      </IconButton>

      <Box mb={2}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          Add Advance Payment
        </Typography>
        <Divider sx={{ marginY: 2 }} />
      </Box>

      <Grid container spacing={3}>
        {/* Row 1: Name */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            Name
          </Typography>
          <TextField
            value={record?.studentname || ""}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {/* Row 2: Batch and Outstanding Amount */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Batch
          </Typography>
          <TextField
            value={record?.batchname || ""}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Amount (₹)
          </Typography>
          <TextField
            value={record.fees}
            onChange={handlePaymentAmountChange}
            variant="outlined"
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </Grid>

        {/* Row 3: Mode of Payment and Date */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Mode of Payment
          </Typography>
          <TextField
            select
            value={paymentMode}
            onChange={handlePaymentModeChange}
            variant="outlined"
            fullWidth
            placeholder="Select Payment Mode"
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="NetBanking">Net Banking</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Payment Date
          </Typography>
          {/* <input
            type="date"
            id="datePicker"
            name="datePicker"
            value={paymentdate}
            onChange={(e) => setpaymentdate(e.target.value)}
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
          /> */}
          <select
            id="installmentDate"
            name="installmentDate"
            onChange={(e) => {
              setpaymentdate(e.target.value);
              console.log(e.target.value);
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
          >
            {dateOptions.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={5}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!paymentMode}
        >
          Submit Payment
        </Button>
      </Box>
    </>
  );
}

export default AccountPaymentBox;
