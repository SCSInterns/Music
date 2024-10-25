import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
} from "@mui/material";

function ProfileAbout({data}) {
  return (
    <>
      <CardContent className="text-center">
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "#F7F7F7",
            // padding: "10px",
            // margin: "auto",
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
              About
            </Typography>


            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Mobile No -</strong>{" "}
                {data?.additionalFields?.formdata?.MobileNo || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "20px" }}>
                <strong>Email -</strong>{" "}
                {data?.additionalFields?.formdata?.Email || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Academy Name -</strong> {data?.academy_name || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "27px" }}>
                <strong>Course -</strong>{" "}
                {data?.additionalFields?.formdata?.Courses || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Fees -</strong> {data?.additionalFields?.fees || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "115px" }}>
                <strong>Installment Date -</strong>{" "}
                {data?.installementDate || "N/A"}
              </Typography>
            </div>

            <div style={{ display: "flex", padding: "20px" }}>
              <Typography variant="body1">
                <strong>Gender -</strong>{" "}
                {data?.additionalFields?.formdata?.Gender || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: "95px" }}>
                <strong>Status -</strong> {data?.status || "N/A"}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
}

export default ProfileAbout;
