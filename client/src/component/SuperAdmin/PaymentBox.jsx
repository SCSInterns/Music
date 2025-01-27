import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const PaymentBox = ({ admin }) => {
  console.log(admin);
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const [paymentdate, setpaymentdate] = useState("");
  const [paymentmode, setpaymentmode] = useState("");

  const convertDateFormat = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);

    const formattedDate = [
      String(dateObj.getDate()).padStart(2, "0"),
      String(dateObj.getMonth() + 1).padStart(2, "0"),
      dateObj.getFullYear(),
    ].join("-");

    return formattedDate;
  };

  const handleinstallmentsubmition = async () => {
    if (paymentdate === "") {
      toast.error("Please enter the date of payment");
      return;
    }

    if (paymentmode === "") {
      toast.error("Please enter the mode of payment");
      return;
    }

    const formateddate = convertDateFormat(paymentdate);

    const url = `https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/handlemanualsubspayment`;

    let token = Token();
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: admin[0].academy_name,
          amount: 4000,
          role: role,
          adminid: admin[0].academy_id,
          paymentdate: formateddate,
          paymentmode: paymentmode,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        const message = data.msg;
        toast.error(message);
      }

      if (response.ok) {
        toast.success("Payment Data Added Successfully ");
        setpaymentdate("");
        setpaymentmode("");
      } else {
        toast.error("Payment Details Updation Failed ");
      }
    } catch (error) {
      toast.error("Network error", error);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "#0d1b2a",
        }}
      >
        Payment Receipt
      </Typography>

      <Divider sx={{ marginBottom: "20px" }} />

      {/* Acadmey Info */}
      <Box sx={{ marginBottom: "5px" }}>
        <Typography>
          <strong>Academy Name</strong>: {admin[0].academy_name}
        </Typography>
        <Typography>
          <strong>Renewal Amount</strong>: ₹ 4000
        </Typography>
        <Typography>
          <strong> Renewal Date</strong>: {admin[0].renewaldate}
        </Typography>
      </Box>

      {/* Payment Date & Payment Mode in one row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {/* Payment Date */}
        <Box sx={{ width: "45%" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}
          >
            Payment Date:
          </Typography>
          <input
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
          />
        </Box>

        {/* Payment Mode */}
        <Box sx={{ width: "45%" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}
          >
            Payment Mode:
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <Select
              labelId="payment-mode-select-label"
              id="payment-mode-select"
              value={paymentmode}
              onChange={(e) => setpaymentmode(e.target.value)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                fontSize: "14px",
                height: "50px",
                color: "#333",
              }}
            >
              <MenuItem value={"Debit / Credit Card"}>
                Debit / Credit Card
              </MenuItem>
              <MenuItem value={"Cash"}>Cash</MenuItem>
              <MenuItem value={"Cheque"}>Cheque</MenuItem>
              <MenuItem value={"Upi"}>Upi</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Submit Button */}
      <Box
        sx={{ textAlign: "center", marginTop: "30px", marginBottom: "20px" }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0d1b2a",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px 20px",
            textTransform: "none",
          }}
          onClick={() => {
            handleinstallmentsubmition();
          }}
        >
          Submit Payment
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentBox;
