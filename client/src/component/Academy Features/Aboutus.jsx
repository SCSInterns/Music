import React, { useState } from "react";
import { Divider, TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";

function About() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [eventdesc, seteventdesc] = useState("");
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

  const handledescchange = (e) => {
    seteventdesc(e);
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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/uploadaboutimage";

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
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/uploadabout";

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
      }),
    });

    if (response.ok) {
      toast.success("Data Added Successfully");
      seteventdesc("");
      setImageUrl(null);
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center">
          Add About Your Academy
        </h2>
        <Divider sx={{ my: 4 }} />

        <Box
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          sx={{ alignItems: "flex-start" }}
        >
          {/* Left Section: Image Upload */}
          <Box className="flex flex-col items-center">
            <Box className="w-72 h-72 flex justify-center items-center border-2 border-dashed border-gray-500 rounded-lg relative">
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer text-gray-700"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p>Click to upload an image</p>
                </label>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={handlesubmit}
              disabled={!imageUrl}
              sx={{ marginTop: "15px" }}
            >
              Upload
            </Button>
          </Box>

          {/* Right Section: Description Form */}
          <Box>
            <TextField
              label="About Description"
              multiline
              rows={12}
              fullWidth
              variant="outlined"
              value={eventdesc}
              onChange={(e) => handledescchange(e.target.value)}
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box className="mt-6 flex justify-center">
          <Button
            variant="contained"
            onClick={handlefinalsubmit}
            disabled={!imageUrl || !eventdesc}
          >
            Submit
          </Button>
        </Box>
      </div>
    </>
  );
}

export default About;
