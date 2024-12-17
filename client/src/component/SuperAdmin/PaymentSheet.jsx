import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Typography } from "@mui/material";

function Paymnettable({ info }) {
  return (
    <>
      <div
        style={{
          backgroundColor: "#F8F8F8",
          padding: "15px",
          margin: "auto",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="payment table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Payment Date
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Payment Mode
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Next Payment Date
              </TableCell>
            </TableRow>
          </TableHead>
          {info.length > 0 ? (
            <TableBody>
              {info.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    {row.paymentdate ? row.paymentdate : "N/A"}
                  </TableCell>
                  <TableCell align="left">{row.amount}</TableCell>
                  <TableCell align="left">{row.paymentmode}</TableCell>
                  <TableCell align="left">
                    {row.nextpaymentdate ? row.nextpaymentdate : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="h6" sx={{ color: "#757575" }}>
                    No Data Available
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
}

export default Paymnettable;
