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

const PaymentBox = ({
  data,
  paymentstatsdetails,
  updatepaymentstats,
  switchToPaymentHistory,
}) => {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const [paymentdate, setpaymentdate] = useState("");
  const [paymentmode, setpaymentmode] = useState("");
  const [paymentdetails, setpaymentdetails] = useState({
    academyname: `${academyname}`,
    role: `${role}`,
    enrollmentDate: "",
    paymentmode: "",
  });

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

  console.log(data.additionalFields?.formdata?.Courses);

  useEffect(() => {
    setpaymentdetails({
      ...paymentdetails,
      paymentmode: paymentmode,
    });
  }, [paymentmode]);

  useEffect(() => {
    setpaymentdetails({
      ...paymentdetails,
      enrollmentDate: convertDateFormat(paymentdate),
    });
  }, [paymentdate]);

  const addlatestpaymentdue = async (
    id,
    paymentdate,
    studentname,
    studentemail,
    paymentmode,
    amount,
    course
  ) => {
    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/addlatestdue";
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentname: studentname,
        academyname: academyname,
        role: role,
        studentid: id,
        paymentdate: paymentdate,
        studentemail: studentemail,
        paymentmode: paymentmode,
        amount: amount,
        course: course,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      updatepaymentstats(data);
      switchToPaymentHistory();
      toast.success("Latest Payment Due Updated");
    } else {
      toast.error("Error Updating latest Due Date ");
    }
  };

  console.log(paymentdetails);

  const handleinstallmentsubmition = async (id) => {
    if (paymentdetails.enrollmentDate === "NaN-NaN-NaN") {
      toast.error("Please enter the date of payment");
      return;
    }

    if (paymentdetails.paymentmode === "") {
      toast.error("Please enter the mode of payment");
      return;
    }

    const url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/addpaymentdetails/${id}`;

    let token = Token();
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: paymentdetails.academyname,
          course: data.additionalFields?.formdata?.Courses,
          amount: data.additionalFields?.fees,
          role: paymentdetails.role,
          studentname: data.additionalFields?.formdata?.Name,
          enrollmentDate: paymentdetails.enrollmentDate,
          paymentmode: paymentdetails.paymentmode,
          studentemail: data.additionalFields?.formdata?.Email,
        }),
      });

      if (response.status === 400) {
        toast.error("Installment paid already");
      }

      if (response.ok) {
        toast.success("Payment Data Added Successfully ");

        await addlatestpaymentdue(
          id,
          paymentdetails.enrollmentDate,
          data.additionalFields?.formdata?.Name,
          data.additionalFields?.formdata?.Email,
          paymentdetails.paymentmode,
          data.additionalFields?.fees,
          data.additionalFields?.formdata?.Courses
        );
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

      {/* Student Info */}
      <Box sx={{ marginBottom: "5px" }}>
        <Typography>
          <strong>Student Name</strong>: {data.additionalFields.formdata?.Name}
        </Typography>
        <Typography>
          <strong>Course</strong>: {data.additionalFields.formdata?.Courses}
        </Typography>
        <Typography>
          <strong>Installment Amount</strong>: {data.additionalFields.fees}
        </Typography>
        <Typography>
          <strong> Installment Date</strong>:{" "}
          {paymentstatsdetails.nextpaymentdate
            ? paymentstatsdetails.nextpaymentdate
            : data.installementDate}
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
          onClick={() => handleinstallmentsubmition(data._id)}
        >
          Submit Payment
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentBox;
