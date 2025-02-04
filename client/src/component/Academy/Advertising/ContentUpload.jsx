import React, { useState } from "react";
import Header from "../../MarketPlace/Subcomponents/Header";
import { Music, Menu } from "lucide-react";
import Laptop from "../../../static/Images/LaptopFrame.png";
import Mobile from "../../../static/Images/MobileFrame.png";
import { Button } from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

function BannerPreviewUploader({ record, onClose, onUpdate }) {
  console.log(record.section);
  const [image, setImage] = useState(null);
  const token = Token();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const validateImageDimensions = async (image) => {
    const section = record.section;
    if (section === "Banner") {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(image);

        img.onload = () => {
          if (img.width !== 1024 || img.height !== 576) {
            toast.error(
              "Please upload the banner with the required resolution (1024x576)"
            );
            URL.revokeObjectURL(objectUrl);
            resolve(false);
          } else {
            URL.revokeObjectURL(objectUrl);
            resolve(true);
          }
        };

        img.onerror = () => {
          toast.error("Error loading the image. Please try again.");
          URL.revokeObjectURL(objectUrl);
          resolve(false);
        };

        img.src = objectUrl;
      });
    }
    if (section === "Featured") {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(image);

        img.onload = () => {
          if (img.width !== 750 || img.height !== 750) {
            toast.error(
              "Please upload the banner with the required resolution (750x750)"
            );
            URL.revokeObjectURL(objectUrl);
            resolve(false);
          } else {
            URL.revokeObjectURL(objectUrl);
            resolve(true);
          }
        };

        img.onerror = () => {
          toast.error("Error loading the image. Please try again.");
          URL.revokeObjectURL(objectUrl);
          resolve(false);
        };

        img.src = objectUrl;
      });
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateImageDimensions(image);
    if (!isValid) {
      setImage(null);
      return;
    }

    const url = "http://localhost:5000/api/auth/uploadadvbanner";

    const data = new FormData();
    data.append("picture", image);
    data.append("id", record.id);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: data,
      });

      const result = await response.json();
      const message = result.message;

      if (response.ok) {
        toast.success(message);
        setImage(null);
        onUpdate();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while uploading the image.");
    }
  };

  const cards = [];
  if (image !== null && record.section === "Featured") {
    cards.push({
      title: sessionStorage.getItem("academyname"),
      location: sessionStorage.getItem("city"),
      src: URL.createObjectURL(image),
    });
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      {/* File Upload Input */}
      {!image && (
        <>
          <label
            htmlFor="bannerUpload"
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Upload Banner
          </label>
          <input
            type="file"
            id="bannerUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </>
      )}

      {image && (
        <div className="w-full flex flex-col items-center space-y-6">
          {/* Desktop Preview */}
          <div
            className="relative bg-cover bg-center w-full h-96 flex justify-center items-start"
            style={{
              backgroundImage: `url(${Laptop})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              zIndex: 20,
            }}
          >
            <div className="absolute w-[80%] h-[50%] bg-transparent shadow-lg overflow-hidden flex flex-col items-center justify-between z-10 mt-6 px-2 ">
              <div className="w-full flex items-center justify-between px-4 py-2 bg-white">
                <div className="flex items-center space-x-2">
                  <Music className="h-3 w-3 text-primary" />
                  <span className="text-xs font-bold text-gray-800">
                    MusicVista
                  </span>

                  <div className="flex items-center space-x-1 !justify-end w-full !ml-12">
                    <p className="text-[7px] font-semibold">Find Academy</p>
                    <p className="text-[7px] font-semibold">Academy</p>
                    <p className="text-[7px] font-semibold">About us</p>
                    <p className="text-[7px] font-semibold">Features</p>
                    <p className="text-[7px] font-semibold">
                      Register Your Academy
                    </p>
                  </div>
                </div>
              </div>

              {record.section === "Banner" && (
                <div className="flex-grow flex items-center justify-center w-full">
                  {/* Banner Image */}
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Desktop Banner Preview"
                    className="w-full h-full object-fill"
                  />
                </div>
              )}
              {record.section === "Featured" && (
                <div className="flex-grow flex items-start absolute  mt-10 justify-center w-full !h-80 z-30">
                  <div>
                    <div className="relative top-8 -left-1 px-4 bg-red-500 text-white text-[8px] w-fit -rotate-45 z-20">
                      Featured
                    </div>

                    <img
                      src={URL.createObjectURL(image)}
                      alt=""
                      height={"150px"}
                      width={"150px"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Preview */}
          <div
            className="relative bg-cover bg-center w-full h-96 flex justify-center items-start"
            style={{
              backgroundImage: `url(${Mobile})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              zIndex: 20,
            }}
          >
            <div className="w-36 h-auto mt-14 bg-transparent rounded-lg shadow-lg overflow-hidden flex flex-col px-2">
              <div className="relative bg-white flex items-center justify-between py-2">
                <div className="flex items-center space-x-1">
                  <Music className="h-3 w-3 text-primary" />
                  <span className="text-xs font-bold ">MusicVista</span>
                </div>
                <Menu className="h-3 w-3 text-primary" />
              </div>

              {record.section === "Banner" && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Mobile Banner Preview"
                  className="w-full h-1/2 object-fill"
                />
              )}
              {record.section === "Featured" && (
                <div className="flex-grow flex items-start relative justify-center w-full !h-80 z-30">
                  <div>
                    <div className="absolute top-3.5 -left-0.5 px-2.5 bg-red-500 text-white text-[5px] w-fit -rotate-45 z-20">
                      Featured
                    </div>
                    <img
                      src={URL.createObjectURL(image)}
                      alt=""
                      height={"250px"}
                      width={"250px"}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!image && (
        <>
          <p className="text-gray-500">
            No banner uploaded. Please upload a banner to preview.
          </p>

          {record.section === "Banner" && (
            <p className="text-blue-900 font-bold mt-5">
              Note: Banner resolution should be
              <span className="text-red-500"> 1024</span> *
              <span className="text-red-500"> 576 </span>
              pixels.
            </p>
          )}

          {record.section === "Featured" && (
            <p className="text-blue-900 font-bold mt-5">
              Note: Banner resolution should be
              <span className="text-red-500"> 750</span> *
              <span className="text-red-500"> 750 </span>
              pixels.
            </p>
          )}

          <p className="text-blue-900 font-bold mt-5">
            Reference Link: &nbsp;
            <a
              href="https://www.iloveimg.com/resize-image"
              className="text-red-500"
              target="_blank"
            >
              https://www.iloveimg.com/resize-image
            </a>
          </p>
        </>
      )}

      {image && (
        <div
          className="absolute bottom-4 right-4 flex space-x-4"
          style={{ zIndex: 50 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Publish
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setImage(null)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export default BannerPreviewUploader;
