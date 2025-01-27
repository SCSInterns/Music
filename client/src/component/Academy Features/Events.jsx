import React, { useState } from "react";
import { Divider, TextField, Button, Box, Grid } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";

function Events() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [eventtitle, seteventtitle] = useState("");
  const [eventdesc, seteventdesc] = useState("");
  const [eventtime, seteventtime] = useState("");
  const [eventdate, seteventdate] = useState("");
  const [eventlocation, seteventlocation] = useState("");
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

  const handlechange = (e) => {
    seteventtitle(e);
  };

  const handledescchange = (e) => {
    seteventdesc(e);
  };
  const handlelocchange = (e) => {
    seteventlocation(e);
  };
  const handledatechange = (e) => {
    seteventdate(e);
  };
  const handletimechange = (e) => {
    seteventtime(e);
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
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/uploadeventimage";

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
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/uploadevents";

    const token = Token();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        academyname: academyname,
        imageUrl: imageUrl,
        description: eventdesc,
        eventname: eventtitle,
        date: eventdate,
        time: eventtime,
        location: eventlocation,
      }),
    });

    if (response.ok) {
      toast.success("Data Added Successfully");
      seteventtitle("");
      seteventdesc("");
      seteventdate("");
      seteventtime("");
      seteventlocation("");
      setImageUrl(null);
    }
  };

  console.log(eventdate);
  console.log(eventtime);
  console.log(eventlocation);

  return (
    <>
      <h2 style={{ fontWeight: "bold", textAlign: "center" }}>
        Add Your Academy Events Details
      </h2>
      <Divider sx={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ marginTop: "60px" }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Image Upload Section */}
          <Grid item xs={12} sm={6} md={4}>
            <div
              style={{
                height: "300px",
                width: "100%",
                maxWidth: "300px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed black",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              {imageUrl ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
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

            <Button
              variant="contained"
              fullWidth
              onClick={handlesubmit}
              disabled={!selectedImage}
              sx={{ marginTop: 2 }}
            >
              Upload
            </Button>
          </Grid>

          {/* Event Details Section */}
          <Grid item xs={12} sm={6} md={8}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "& > :not(style)": { m: 1, width: "100%" },
              }}
              noValidate
              autoComplete="off"
            >
              {/* Event Title */}
              <TextField
                id="outlined-basic"
                label="Event Name"
                variant="outlined"
                value={eventtitle}
                onChange={(e) => handlechange(e.target.value)}
              />

              {/* Date and Time */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  label="Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={eventdate}
                  onChange={(e) => handledatechange(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Time"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={eventtime}
                  variant="outlined"
                  onChange={(e) => handletimechange(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* Location */}
              <TextField
                label="Location"
                value={eventlocation}
                variant="outlined"
                fullWidth
                onChange={(e) => handlelocchange(e.target.value)}
              />

              {/* Event Description */}
              <TextField
                label="Event Description"
                multiline
                rows={8}
                variant="outlined"
                value={eventdesc}
                fullWidth
                onChange={(e) => handledescchange(e.target.value)}
              />
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Submit Button */}
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={!imageUrl || !eventtitle || !eventdesc}
          onClick={handlefinalsubmit}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}

export default Events;
