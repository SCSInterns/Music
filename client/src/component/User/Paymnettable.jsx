import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";

function Paymnettable({ info }) {
  console.log(info);

  return (
    <>
      <div
        style={{
          borderRadius: "16px",
          backgroundColor: "#F7F7F7",
          padding: "10px",
          margin: "auto",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <Typography
          variant="h5"
          className="font-semibold"
          sx={{
            fontFamily: "ubuntu",
            color: "#9C27B0",
            marginBottom: "16px",
            padding: "10px",
          }}
        >
          Payment Info
        </Typography>

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
            </TableRow>
          </TableHead>
          <TableBody>
            {info.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  No Payment Info Found
                </TableCell>
              </TableRow>
            ) : (
              info.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    {row.paymentdate ? row.paymentdate : "N/A"}
                  </TableCell>
                  <TableCell align="left">{row.transactionamount}</TableCell>
                  <TableCell align="left">{row.course}</TableCell>
                  <TableCell align="left">{row.paymentmode}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Paymnettable;
