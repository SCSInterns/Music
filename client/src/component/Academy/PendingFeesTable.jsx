import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

function PendingFeesTable({ data }) {
  return (
    <TableContainer component={Paper}>
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
            <TableCell>Academy Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.studentname}</TableCell>
                <TableCell>{row.studentemail}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.paymentmode}</TableCell>
                <TableCell>{row.enrollmentDate}</TableCell>
                <TableCell>{row.nextPaymentDate}</TableCell>
                <TableCell>{row.academyname}</TableCell>
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
  );
}

export default PendingFeesTable;
