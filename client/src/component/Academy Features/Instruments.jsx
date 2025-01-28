import React, { useState } from "react";
import { Divider, TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";

function Instrument() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [instrumentName, setInstrumentName] = useState("");
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setImageUrl(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl(null);
  };

  const handleInstrumentChange = (e) => {
    setInstrumentName(e.target.value);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("picture", selectedImage);

    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/uploadintrumentimage";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error uploading image");
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      toast.success("Image uploaded successfully");
      setImageUrl(data.imageUrl);
      setSelectedImage(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Image upload failed");
    }
  };

  const handlefinalsubmit = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/uploadinstrument";

    const token = Token();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        url: imageUrl,
        label: instrumentName,
      }),
    });

    if (response.ok) {
      toast.success("Data Added Successfully");
      setInstrumentName("");
      setImageUrl(null);
    }
  };

  return (
    <>
      <h2 style={{ fontWeight: "bold" }}>Add Instruments</h2>
      <Divider sx={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ display: "flex", marginTop: "60px" }}>
        <div>
          <div
            style={{
              height: "200px",
              width: "200px",
              marginTop: "10px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed black",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            {imageUrl ? (
              <div style={{ position: "relative" }}>
                <img
                  src={imageUrl}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <button
                  onClick={handleRemoveImage}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "black",
                }}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <p>Click to upload an image</p>
              </label>
            )}
          </div>

          {selectedImage ? (
            <Button variant="contained" onClick={handlesubmit}>
              Upload
            </Button>
          ) : (
            <Button variant="contained" onClick={handlesubmit} disabled>
              Upload
            </Button>
          )}
        </div>

        <div>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": {
                  m: 1,
                  width: "600px",
                  marginLeft: "20px",
                  marginTop: "50px",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Instrument Name"
                sx={{ marginTop: "15px" }}
                multiline
                variant="outlined"
                rows={4}
                value={instrumentName}
                fullWidth
                onChange={handleInstrumentChange}
              />
            </Box>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px", float: "right", marginRight: "20px" }}>
        {imageUrl && instrumentName ? (
          <Button
            variant="contained"
            onClick={() => {
              handlefinalsubmit();
            }}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled
            onClick={() => {
              handlefinalsubmit();
            }}
          >
            Submit
          </Button>
        )}
      </div>
    </>
  );
}

export default Instrument;
