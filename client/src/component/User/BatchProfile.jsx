import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function BatchProfile({ details }) {
  return (
    <>
      <CardContent className="text-center">
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "#F7F7F7",
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              className="font-semibold"
              sx={{
                fontFamily: "ubuntu",
                color: "#9C27B0",
                marginBottom: "16px",
              }}
            >
              Batch Details
            </Typography>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Academy Name -</strong> {details.academyname || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "40px" }}>
                <strong>Batch Name -</strong> {details.batchname || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography
                variant="body1"
              >
                <strong>Batch Type -</strong> {details?.batchtype || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Days -</strong> {details?.days?.join(", ") || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Start Time -</strong> {details?.starttime || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "80px" }}>
                <strong>End Time -</strong> {details?.endtime || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Theory Days -</strong>{" "}
                {details?.theorydays?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "45px" }}>
                <strong>Practical Days -</strong>{" "}
                {details?.practicaldays?.join(", ") || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>No of Students -</strong>{" "}
                {details?.noofstudents || "N/A"}
              </Typography>
            </div>

            <div style={{ padding: "20px" }}>
              <Typography variant="body1">
                <strong>Instruments :</strong>
              </Typography>
              {details?.instrument_types?.length > 0 ? (
                details.instrument_types.map((instrument, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", paddingTop: "10px", marginTop: "20px" }}
                  >
                    <Typography variant="body2">
                      <strong>Type -</strong> {instrument.type || "N/A"}
                    </Typography>
                    <Typography variant="body2" style={{ marginLeft: "20px" }}>
                      <strong>Quantity -</strong> {instrument.quantity || "N/A"}
                    </Typography>
                    <Typography variant="body2" style={{ marginLeft: "20px" }}>
                      <strong>Current Students -</strong>{" "}
                      {instrument.currentstudentcount || "N/A"}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" style={{ marginTop: "10px" }}>
                  No Instruments Assigned
                </Typography>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
}

export default BatchProfile;
