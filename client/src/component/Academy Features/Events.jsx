import React from "react";
import Divider from "@mui/material/Divider";
import { TextField, Button } from "@mui/material";

function Events() {
  return (
    <>
      <h2 style={{ fontWeight: "bold" }}>Add Your Acadmey Events Details</h2>
      <Divider sx={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ display: "flex", marginTop: "60px" }}>
        <div>
          <div
            style={{
              height: "300px",
              width: "300px",
              marginTop: "10px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed black",
              borderRadius: "10px",
            }}
          >
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
              />
              <p>Click to upload an image</p>
            </label>
          </div>

          <Button variant="contained">Upload</Button>
        </div>

        <div></div>
        <div
          style={{
            height: "300px",
            width: "600px",
            marginLeft: "20px",
          }}
        >
          {/* textarea */}
          <TextField
            label="Event Description"
            multiline
            rows={11}
            sx={{ marginTop: "15px" }}
            variant="outlined"
            fullWidth
          />
        </div>
      </div>

      <div style={{ marginTop: "30px", float: "right", marginRight: "20px" }}>
        <Button variant="contained">Submit</Button>
      </div>
    </>
  );
}

export default Events;
