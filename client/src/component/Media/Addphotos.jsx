import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import MediaMenu from "./MediaMenu";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import Token from "../Token/Token";

const MultipleImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [menutoggle, setmenutoggle] = useState(false);
  const [toggle, settoggle] = useState(true);

  const academyname = sessionStorage.getItem("academyname");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          toast.warn(
            `Skipped "${file.name}" because it is not a valid MIME type.`
          );
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]); ;
      }
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const url = "http://localhost:5000/api/auth/uploadgalleryphotos";
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedUrls(data.urls);
        toast.success("Images Uploaded Successfully");
      } else {
        console.error("Error uploading images");
        toast.error("Error uploading images");
      }
    } catch (error) {
      console.error("Error uploading images", error);
      toast.error("Error uploading images");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setLoading(true);
    settoggle(false);
    setTimeout(() => {
      setLoading(false);
      setmenutoggle(true);
    }, 2000);
  };

  const handleadditiontodb = async (imageurl) => {
    const url = "http://localhost:5000/api/auth/uploadgallerytodb";
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyName: academyname,
        imageUrls: imageurl,
      }),
    });

    if (response.ok) {
      setUploadedUrls([])
      setFiles([])
      toast.success("Saved to database");
    } else {
      toast.error("Error saving to database");
    }
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      {toggle && (
        <Box>
          <Box
            {...getRootProps()}
            p={2}
            border="2px dashed #ccc"
            textAlign="center"
            sx={{ margin: "100px" }}
          >
            <input {...getInputProps()} />
            <Typography>
              Drag and drop images here, or click to select files
            </Typography>
          </Box>

          {files.length > 0 && (
            <Typography>{files.length} file(s) selected</Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading || files.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : "Upload Images"}
          </Button>

          <Box mt={2}>
            {uploadedUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded ${index}`}
                style={{
                  maxWidth: "300px",
                  marginRight: "10px",
                  margin: "auto",
                  padding: "10px",
                }} // Add styles to limit image size
              />
            ))}
          </Box>

          {uploadedUrls.length > 0 && (
            <>
              <div style={{ marginTop: "50px" }}>
                <Button
                  variant="contained"
                  onClick={() => handleadditiontodb(uploadedUrls)}
                  disabled={loading || uploadedUrls.length === 0}
                >
                  Submit
                </Button>
              </div>
            </>
          )}

          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              float: "right",
              marginRight: "30px",
              marginBottom: "30px",
              marginTop: "30px",
            }}
          >
            Back
          </Button>
        </Box>
      )}

      {menutoggle && <MediaMenu />}
    </>
  );
};

export default MultipleImageUpload;
