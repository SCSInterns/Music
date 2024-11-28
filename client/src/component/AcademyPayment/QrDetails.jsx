import React, { useState } from "react";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

const QRCodeUploadForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("Please upload a QR code image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", selectedImage);

    const url = "http://localhost:5000/api/auth/uploadqr";
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload QR code");
      }

      const data = await response.json();
      toast.success("QR code uploaded successfully");
      setImageUrl(data.imageUrl);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error uploading QR code:", error);
      toast.error("Error uploading QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQRCode = async () => {
    if (!imageUrl) {
      toast.error("Please upload and confirm the QR code first.");
      return;
    }

    const url = "http://localhost:5000/api/auth/uploadqrdata";
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          academyname,
          link: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save QR code data");
      }

      toast.success("QR code data saved successfully");
      setImageUrl(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error saving QR code data:", error);
      toast.error("Error saving QR code data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}

      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Upload QR Code for Payment
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    bgcolor: "#0d1b2a",
                    padding: "10px",
                    "&:hover": { bgcolor: "#1e3a5f" },
                  }}
                >
                  Upload QR Code
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                {imageUrl && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Preview:
                    </Typography>
                    <img
                      src={imageUrl}
                      alt="QR Code Preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mt: 2 }}
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || !imageUrl}
                  sx={{ marginTop: "5px" }}
                >
                  Confirm Upload
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveQRCode}
                  sx={{ marginTop: "5px" }}
                  disabled={!imageUrl || loading}
                >
                  Save QR Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default QRCodeUploadForm;
