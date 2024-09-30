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

    const url = "http://localhost:5000/api/auth/uploadlogo";

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
      const url = "http://localhost:5000/api/auth/uploadlogodata";
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
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        {defaulttoggle && (
          <> 
             
            {selectedImage ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Selected"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg">
                <p className="text-gray-500">No image selected</p>
              </div>
            )}

            <label className="cursor-pointer bg-blue-950 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
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
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-400"
            >
              Upload
            </button> 

            <div style={{ marginLeft: "700px" }}>
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{
                      marginRight: "30px",
                      marginBottom: "30px",
                      marginTop: "30px",
                    }}
                  >
                    Back
                  </Button>
                </div>

            {imageUrl && (
              <>
                <div className="mt-4">
                  <p className="text-gray-700">Uploaded Image URL:</p>
                  <a
                    href={imageUrl}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {imageUrl}
                  </a>
                </div>

                <div>
                  <img
                    src={`${imageUrl}?w=200&h=200`}
                    alt="Resized Image"
                    width={300}
                    height={300}
                    style={{
                      marginBottom: "50px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <Button
                    variant="contained"
                    onClick={() => handlelogostoring()}
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
