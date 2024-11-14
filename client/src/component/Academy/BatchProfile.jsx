import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import Token from "../Token/Token";
import { Card, CardContent, Typography } from "@mui/material";

function BatchProfile({ batchdata }) {
  console.log(batchdata);

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
            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Academy Name -</strong> {batchdata.academyname || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "40px" }}>
                <strong>Batch Name -</strong> {batchdata.batchname || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Batch Type -</strong> {batchdata?.batchtype || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Days -</strong> {batchdata?.days?.join(", ") || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Start Time -</strong> {batchdata?.starttime || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "80px" }}>
                <strong>End Time -</strong> {batchdata?.endtime || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Theory Days -</strong>{" "}
                {batchdata?.theorydays?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "45px" }}>
                <strong>Practical Days -</strong>{" "}
                {batchdata?.practicaldays?.join(", ") || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>No of Students -</strong>{" "}
                {batchdata?.noofstudents || "N/A"}
              </Typography>
            </div>

            <div style={{ padding: "20px" }}>
              <Typography variant="body1">
                <strong>Instruments :</strong>
              </Typography>
              {batchdata?.instrument_types?.length > 0 ? (
                batchdata.instrument_types.map((instrument, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      paddingTop: "10px",
                      marginTop: "20px",
                    }}
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
