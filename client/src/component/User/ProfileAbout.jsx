import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

function ProfileAbout({ data }) {
  // Extract only additionalFields data
  const additionalFields = data?.additionalFields || {};

  const flattenData = (obj) => {
    let result = [];
    for (const key in obj) {
      result.push({
        label: key,
        value: obj[key] || "N/A",
      });
    }
    return result;
  };

  const tableData = flattenData(additionalFields);

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: "30px",
        borderRadius: "16px",
        backgroundColor: "#F7F7F7",
      }}
    >
      <Typography
        variant="h5"
        className="font-semibold"
        sx={{
          fontFamily: "ubuntu",
          color: "#9C27B0",
          textAlign: "center",
          marginTop: "16px",
          padding: "8px",
        }}
      >
        About
      </Typography>
      <Table>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {row.label.replace(/([a-z])([A-Z])/g, "$1 $2")}{" "}
                {/* Format label */}
              </TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProfileAbout;
