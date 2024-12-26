import React, { useState, useEffect } from "react";
import { TextField, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import { QrReader } from "react-qr-reader";
import HeaderAutoAttend from "./HeaderAutoAttend";

function AutomatedAttendanceLogger() {
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [rollno, setrollno] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(true);
  const academyName = sessionStorage.getItem("academyname");
  const token = Token();

  useEffect(() => {
    setRole(sessionStorage.getItem("role"));
  }, []);

  // Log attendance with passed student and batch IDs
  const logAttendance = async (studentid, batchid, rollno) => {
    console.log("Log Attendance with:", studentid, batchid, rollno);

    if (!studentid || !batchid || !academyName || !rollno) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      setScannerEnabled(true);
      return;
    }

    const url =
      "https://music-academy-e32v.onrender.com/api/auth/log-attendance";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentid: studentid,
          academyname: academyName,
          role: role,
          batchid: batchid,
          currentrollno: rollno,
        }),
      });

      setLoading(false);
      setScannerEnabled(true);

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
      setLoading(false);
      setScannerEnabled(true);
      toast.error("An error occurred while logging attendance.");
    }
  };

  // Handle QR code scan result
  const handleScan = async (data) => {
    if (data && scannerEnabled) {
      console.log("Scanned Data:", data);
      try {
        const scannedData = JSON.parse(data);
        if (scannedData.studentid && scannedData.batchid) {
          setStudentId(scannedData.studentid);
          setBatchId(scannedData.batchid);
          setrollno(scannedData.rollno);
          toast.success("QR Code scanned successfully!");

          setScannerEnabled(false);
          setLoading(true);
          setTimeout(() => {
            logAttendance(
              scannedData.studentid,
              scannedData.batchid,
              scannedData.rollno
            );
          }, 4000);
        } else {
          toast.error("Invalid QR code format: Missing studentid or batchid.");
        }
      } catch (error) {
        toast.error("Invalid QR code format.");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
  };

  if (role !== "Admin") {
    return <Typography variant="h6">Access Denied: Admins only.</Typography>;
  }

  return (
    <>
      <HeaderAutoAttend />
      <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Automated Attendance Logger
        </Typography>

        {/* QR Code Scanner */}
        {scannerEnabled && (
          <QrReader
            delay={300}
            onResult={(result, error) => {
              if (result) handleScan(result.text);
              if (error) handleError(error);
            }}
            style={{ width: "100%" }}
          />
        )}

        {/* Loader */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <div>
              <TextField
                label="Student ID"
                value={studentId}
                fullWidth
                margin="normal"
                required
                disabled
              />
              <TextField
                label="Batch ID"
                value={batchId}
                fullWidth
                margin="normal"
                required
                disabled
              />
              <TextField
                label="Roll No"
                value={rollno}
                fullWidth
                margin="normal"
                required
                disabled
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AutomatedAttendanceLogger;
