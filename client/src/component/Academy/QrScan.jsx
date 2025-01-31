import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import { QrReader } from "react-qr-reader";

function AttendanceLogger() {
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [rollno, setrollno] = useState("");
  const [role, setRole] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const academyName = sessionStorage.getItem("academyname");
  const roled = sessionStorage.getItem("role");
  const token = Token();

  useEffect(() => {
    const userRole = sessionStorage.getItem("role");
    setRole(userRole);
  }, [roled]);

  // Log attendance after scanning QR code
  const logAttendance = async () => {
    if (!studentId || !batchId || !academyName || !rollno) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/log-attendance";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentid: studentId,
          academyname: academyName,
          role: role,
          batchid: batchId,
          currentrollno: rollno,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.msg || "An error occurred");
      } else {
        toast.success("Attendance logged successfully.");
        setStudentId("");
        setBatchId("");
        setrollno("");
      }
    } catch (error) {
      console.error("Error logging attendance:", error);
      toast.error("An error occurred while logging attendance.");
    }
  };

  // Handle QR code scan result
  const handleScan = (data) => {
    if (data) {
      const scannedData = JSON.parse(data);
      setStudentId(scannedData.studentid);
      setBatchId(scannedData.batchid);
      setrollno(scannedData.rollno);
      setShowScanner(false);
      toast.success("QR Code scanned successfully!");
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  if (role !== "Admin") {
    return <Typography variant="h6">Access Denied: Admins only.</Typography>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Log Attendance
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        onClick={() => setShowScanner(!showScanner)}
        style={{ marginBottom: "20px" }}
      >
        {showScanner ? "Close QR Scanner" : "Open QR Scanner"}
      </Button>

      {showScanner && (
        <QrReader
          delay={300}
          onResult={(result, error) => {
            if (result) handleScan(result.text);
            if (error) handleError(error);
          }}
          style={{ width: "100%" }}
        />
      )}

      <TextField
        label="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Roll No"
        value={rollno}
        onChange={(e) => setrollno(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={logAttendance}
        style={{ marginTop: "20px" }}
      >
        Log Attendance
      </Button>
    </div>
  );
}

export default AttendanceLogger;
