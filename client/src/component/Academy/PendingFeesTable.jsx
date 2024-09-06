import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function PendingFeesTable({ data }) {
  const [date, setdate] = useState("");
  const [formatdate, setformatdate] = useState("");
  const [filtereddata, setfiltereddata] = useState([]);

  const formatedDate = (date) => {
    const [year, month, day] = date.split("-");
    setformatdate(`${day}-${month}-${year}`);
  };

  useEffect(() => {
    formatedDate(date);
  }, [date]);

  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handlecustomisedate = async (date, academyname, role) => {
    const url = "http://localhost:5000/api/auth/getpaymnetdue";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        currentdate: date,
      }),
    });

    if (response.ok) {
      let data = await response.json();
      setfiltereddata(data);
      toast.success("Filtered Success");
    } else {
      toast.error("Error fetching filtered data");
    }
  };

  return (
    <>
      <div>
        <Typography
          sx={{
            marginBottom: "20px",
            marginTop: "-20px",
            alignContent: "left",
            display: "flex",
          }}
        >
          Payment Date :
          <input
            type="date"
            id="datePicker"
            name="datePicker"
            onChange={(e) => setdate(e.target.value)}
          ></input>
          <Button
            variant="contained"
            sx={{ marginLeft: "50px" }}
            onClick={() => {
              handlecustomisedate(formatdate, academyname, role);
            }}
          >
            Submit
          </Button>
        </Typography>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{ border: "2px solid black", padding: "3px" }}
        >
          <Table aria-label="pending fees table">
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Student Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Next Payment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filtereddata.length > 0 ? filtereddata : data).length > 0 ? (
                (filtereddata.length > 0 ? filtereddata : data).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.studentname}</TableCell>
                    <TableCell>{row.studentemail}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.paymentmode}</TableCell>
                    <TableCell>{row.enrollmentDate}</TableCell>
                    <TableCell sx={{fontWeight:'bold'}}>{row.nextPaymentDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default PendingFeesTable;
