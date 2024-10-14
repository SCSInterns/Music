import React, { useState } from "react";
import { Divider, TextField, Button, Box } from "@mui/material";
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

    const url = "http://localhost:5000/api/auth/uploadeventimage";

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
    const url = "http://localhost:5000/api/auth/uploadevents";

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
      <h2 style={{ fontWeight: "bold" }}>Add Your Academy Events Details</h2>
      <Divider sx={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ display: "flex", marginTop: "60px" }}>
        <div>
          <div
            style={{
              height: "300px",
              width: "300px",
              marginTop: "90px",
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
                "& > :not(style)": { m: 1, width: "600px", marginLeft: "20px" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Event Name"
                variant="outlined"
                value={eventtitle}
                onChange={(e) => {
                  handlechange(e.target.value);
                }}
              />
            </Box>
          </div>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              margin: "20px",
            }}
          >
            <div style={{ display: "flex" }}>
              {/* Date Input */}
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
                sx={{ marginRight: "10px" }}
              />

              {/* Time Input */}
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
                sx={{ marginLeft: "10px" }}
              />
            </div>

            {/* Location Input */}
            <TextField
              label="Location"
              value={eventlocation}
              variant="outlined"
              fullWidth
              onChange={(e) => handlelocchange(e.target.value)}
            />
          </Box>
          <div
            style={{
              height: "300px",
              width: "600px",
              marginLeft: "20px",
            }}
          >
            <TextField
              label="Event Description"
              multiline
              rows={8}
              sx={{ marginTop: "15px" }}
              variant="outlined"
              value={eventdesc}
              fullWidth
              onChange={(e) => handledescchange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          float: "right",
          marginRight: "20px",
          marginBottom: "50px",
        }}
      >
        {imageUrl && eventtitle && eventdesc ? (
          <Button
            variant="contained"
            onClick={() => {
              handlefinalsubmit();
            }}
          >
            Submit
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              disabled
              onClick={() => {
                handlefinalsubmit();
              }}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default Events;
