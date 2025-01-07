import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function BatchProfile({ batchdata }) {
  return (
    <>
      <CardContent className="text-center">
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <CardContent>
            {/* Academy and Batch Info */}
            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Academy Name -</strong> {batchdata.academyname || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "40px" }}>
                <strong>Batch Name -</strong> {batchdata.batchname || "N/A"}
              </Typography>
            </div>

            {/* Schedule Table */}
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6">Schedule</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Day</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Start Time</strong>
                      </TableCell>
                      <TableCell>
                        <strong>End Time</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Class Type</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batchdata.schedule.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.day}</TableCell>
                        <TableCell>{item.starttime}</TableCell>
                        <TableCell>{item.endtime}</TableCell>
                        <TableCell>{item.classtype}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
}

export default BatchProfile;
