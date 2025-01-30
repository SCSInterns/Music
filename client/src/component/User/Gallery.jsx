import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const academyname = sessionStorage.getItem("Academy");

  console.log(photos);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url =
          "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/getimages";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academyname: academyname,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPhotos(data.imageUrls);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-7">
        <header className="text-center py-8">
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#0c4b65",
              lineHeight: "1.8",
              fontSize: "25px",
              fontFamily: "ubuntu",
            }}
          >
            Harmonizing Moments: A Glimpse into Our World of Music
          </h1>
          <p
            className="mt-2"
            style={{
              color: "#0c4b65",
              textAlign: "center",
              marginRight: "70px",
              lineHeight: "1.8",
              marginTop: "25px",
              fontSize: "18px",
              fontFamily: "ubuntu",
            }}
          >
            Experience the rhythm, passion, and creativity that define our
            academy. Explore a gallery where every image tells a story of
            dedication and musical excellence
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-12">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <img
                src={photo}
                alt={photo.title || `Photo ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GalleryPage;
