import React, { useState } from "react";
import { toast } from "react-toastify";
import Token from "../Token/Token";
import { Typography, Button } from "@mui/material";
import Mediamenu from "../Media/MediaMenu";
import Loader from "../Loader/Loader";

const Addlogo = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [defaulttoggle, setdefaulttoggle] = useState(true);
  const [data, setdata] = useState("");
  const [loading, setloading] = useState(false);
  const [togglehome, settogglehome] = useState(false);
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
  };

  const handleBack = () => {
    setloading(true);
    setTimeout(() => {
      settogglehome(true);
      setdefaulttoggle(false);
      setloading(false);
    }, 2000);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    console.log(selectedImage);
    const formData = new FormData();
    formData.append("logo", selectedImage); // Append the image file to form data
    console.log(academyname);
    formData.append("academyname", academyname);
    console.log(academyname);

    console.log("Form Data:", Array.from(formData.entries())); // Log entries

    const url = "https://music-academy-e32v.onrender.com/api/auth/uploadlogo";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error uploading logo");
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      toast.success("Logo uploaded successfully ");
      setImageUrl(data.imageUrl); // Save the uploaded image URL
      setSelectedImage(null);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handlelogostoring = async () => {
    try {
      const url =
        "https://music-academy-e32v.onrender.com/api/auth/uploadlogodata";
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
          link: imageUrl,
        }),
      });

      if (response.ok) {
        const final = await response.json();
        setdata(final);
        toast.success("Logo added Successfully ");
      } else {
        toast.error("Error Saving Logo");
      }
    } catch (error) {
      console.error("Error saving image:", error);
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-10 space-y-6 px-4">
        {defaulttoggle && (
          <>
            {selectedImage ? (
              <div className="relative w-64 h-64">
                <img
                  src={imageUrl}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-700 transition"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg">
                <p className="text-gray-500 text-center">No image selected</p>
              </div>
            )}

            <label className="cursor-pointer bg-blue-950 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <button
              onClick={handlesubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-400 transition"
            >
              Upload
            </button>

            <div className="w-full flex justify-end mt-4">
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{
                  marginRight: "20px",
                  marginBottom: "30px",
                  marginTop: "30px",
                }}
              >
                Back
              </Button>
            </div>

            {imageUrl && (
              <>
                <div className="mt-4 text-center">
                  <p className="text-gray-700">Uploaded Image URL:</p>
                  <a
                    href={imageUrl}
                    className="text-blue-500 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {imageUrl}
                  </a>
                </div>

                <div className="flex justify-center my-6">
                  <img
                    src={`${imageUrl}?w=200&h=200`}
                    alt="Resized Image"
                    className="w-60 h-60 object-cover"
                  />
                </div>

                <div className="flex justify-center mb-6">
                  <Button
                    variant="contained"
                    onClick={() => handlelogostoring()}
                    className="w-full sm:w-auto"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {togglehome && (
          <>
            <Mediamenu />
          </>
        )}
      </div>
    </>
  );
};

export default Addlogo;
