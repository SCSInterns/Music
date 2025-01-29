import React, { useEffect, useState } from "react";
import { CirclePlus, Trash2 as RemoveIcon } from "lucide-react";
import { Button } from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { use } from "react";

const BannerUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState([
    {
      name: "Sample Image 1",
      image: "https://source.unsplash.com/1600x900/?nature,water",
    },
    {
      name: "Sample Image 2",
      image: "https://source.unsplash.com/1600x900/?nature,mountain",
    },
    {
      name: "Sample Image 3",
      image: "https://source.unsplash.com/1600x900/?city,night",
    },
    {
      name: "Sample Image 4",
      image: "https://source.unsplash.com/1600x900/?technology",
    },
    {
      name: "Sample Image 5",
      image: null,
    },
  ]);

  const token = Token();

  const handleDelete = (index) => {
    const filteredBanners = banners.filter((_, i) => i !== index);
    setBanners(filteredBanners);
  };

  const validateImageDimensions = async (image) => {
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
  };

  const handleUpload = async (file, index) => {
    setIsLoading(true);
    if (!file) return;
    const isValid = await validateImageDimensions(file);
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("slot", index + 1);

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/uploadmarketingbanner";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getBanners();
        toast.success("Banner uploaded successfully!");
      } else {
        console.error("Upload failed:", await response.json());
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("An error occurred while uploading the banner.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file, index);
    }
  };

  const getBanners = async () => {
    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getmarketingbanners";

    const response = await fetch(url, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setBanners(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  console.log(banners);

  return (
    <>
      {isLoading && (
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
      <div className="p-5">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Sr No.</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-left font-semibold">
                  {banner.slotNumber}
                </td>
                <td className="px-4 py-2">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.imageUrl}
                      className="w-80 h-90 object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-left">No image uploaded yet</p>
                  )}
                </td>
                <td className="px-4 py-2 text-left ">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`upload-${index}`}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                  <label
                    htmlFor={`upload-${index}`}
                    className="text-blue-500 border border-blue-500 rounded-md px-2 py-1 cursor-pointer"
                  >
                    {banner.imageUrl ? "Replace" : "Upload"}
                  </label>
                  {/* {banner.imageUrl && (
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 border border-red-500 rounded-md px-2 py-1"
                    >
                      <RemoveIcon size={18} />
                    </button>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <>
          <p className="text-blue-900 font-bold mt-8">
            Note: Banner resolution should be
            <span className="text-red-500"> 1024</span> *
            <span className="text-red-500"> 576 </span>
            pixels.
          </p>

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
      </div>
    </>
  );
};

export default BannerUploader;
