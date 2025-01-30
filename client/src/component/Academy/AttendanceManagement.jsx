import React, { useState, useEffect } from "react";
import Token from "../Token/Token";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

function AttendanceManagement({ data }) {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();

  const [qrCodeData, setQrCodeData] = useState("");
  const [batchdata, setBatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBatchDetails = async (studentId) => {
    try {
      const url =
        "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/getbatchdetail";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentid: studentId,
          academyname: academyname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBatchData(data);
        return data;
      } else {
        toast.error("Failed to fetch batch details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching batch details:", error);
      toast.error("An error occurred while fetching batch details");
      return null;
    }
  };

  const generateQR = async (studentId, batchId) => {
    try {
      const url =
        "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/generateqr";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
          role: role,
          studentid: studentId,
          batchid: batchId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.qrcode;
      } else {
        toast.error("Failed to generate QR code");
        return null;
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("An error occurred while generating QR code");
      return null;
    }
  };

  const fetchOrGenerateQR = async (studentId) => {
    setIsLoading(true);
    try {
      const url =
        "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/fetchqr";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
          studentid: studentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeData(data);
      } else {
        const batchData = await fetchBatchDetails(studentId);
        if (batchData && batchData._id) {
          const qrCode = await generateQR(studentId, batchData._id);
          if (qrCode) {
            setQrCodeData(qrCode);
          } else {
            toast.error("Failed to generate new QR code");
          }
        } else {
          toast.error("Batch ID is required to generate QR code");
        }
      }
    } catch (error) {
      console.error("Error in fetchOrGenerateQR:", error);
      toast.error("An error occurred while fetching QR code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data._id) {
      fetchOrGenerateQR(data._id);
    }
  }, [data._id]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <p>Loading QR Code...</p>
      ) : (
        qrCodeData && (
          <img src={qrCodeData} width={300} height={300} alt="QR Code" />
        )
      )}
    </div>
  );
}

export default AttendanceManagement;
