import React, { useState, useEffect } from "react";
import Token from "../Token/Token";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function PaymentDetails({ data }) {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [installmentdata, setInstallmentData] = useState([]);

  const getdata = async (studentid, username) => {
    const url =
      "https://music-academy-e32v.onrender.com/api/auth/getinfoinstallment";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        studentid: studentid,
        academyname: academyname,
        username: username,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setInstallmentData(data);
    } else {
      toast.error("Failed to fetch Installment info ");
    }
  };

  useEffect(() => {
    let id = data.studentid;
    let name = data.username;
    getdata(id, name);
  }, [data]);

  return (
    <div>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              PaymentDate
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Amount
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Course
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              PaymentMode
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              NextPaymentDate
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {installmentdata.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{row.paymentDate}</TableCell>
              <TableCell align="left">{row.amount}</TableCell>
              <TableCell align="left">{row.course}</TableCell>
              <TableCell align="left">{row.paymentmode}</TableCell>
              <TableCell align="left">{row.nextPaymentDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PaymentDetails;
