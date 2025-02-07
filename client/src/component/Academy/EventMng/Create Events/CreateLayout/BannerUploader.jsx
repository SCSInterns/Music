import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

const BannerImagePicker = ({ onImageSelect }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      getImageDimensions(selectedFile)
        .then(({ width, height }) => {
          if (width / height !== 2) {
            toast.error("Please upload an image with a 2:1 aspect ratio!");
            return;
          }

          const imageUrl = URL.createObjectURL(selectedFile);
          setImage(imageUrl);
          setFile(selectedFile);
        })
        .catch((error) => {
          console.error("Error reading image:", error);
        });
    }
  };

  const handleSubmit = () => {
    if (file) {
      onImageSelect(file);
    }
  };

  // Cleanup Object URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  // Helper Function: Get Image Dimensions
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 w-full max-w-4xl mx-auto">
        <label
          htmlFor="banner-upload"
          className="cursor-pointer w-full max-w-4xl relative bg-gray-100 rounded-md overflow-hidden"
          style={{ paddingBottom: "50%" }}
        >
          {image ? (
            <img
              src={image}
              alt="Banner Preview"
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-lg font-medium">
              Click or Drag & Drop to Upload Banner
            </div>
          )}
        </label>
        <input
          type="file"
          id="banner-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <div className="mt-4">
        <Button
          variant="contained"
          className="my-4 float-right"
          onClick={handleSubmit}
          disabled={!file}
        >
          Upload
        </Button>
      </div>
    </>
  );
};

export default BannerImagePicker;
