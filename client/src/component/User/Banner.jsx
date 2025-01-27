import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import IntroText from "./IntroText";

function Gallery() {
  const academyname = sessionStorage.getItem("Academy");
  const [galleryimages, setgalleryimages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queueSize = 4;

  const getimages = async () => {
    const url =
      "https://e673-2401-4900-1c80-453-9857-51b6-65f9-1434.ngrok-free.app/api/auth/getbanner";
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
      setgalleryimages(data.imageUrls);
    } else {
      // toast.error("Images Not found");
    }
  };

  useEffect(() => {
    getimages();
  }, [academyname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (galleryimages.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryimages.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryimages]);

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.5 } },
  };

  const queueVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="relative h-screen w-full">
        {/* Dynamic Background Image */}
        {galleryimages.length > 0 && (
          <motion.div
            key={currentIndex}
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${galleryimages[currentIndex]})`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

        {/* Main Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white">
          {/* Arrow Navigation */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer z-30">
            <button
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + galleryimages.length) %
                    galleryimages.length
                )
              }
              className="bg-gray-800 p-2 rounded-full text-white"
            >
              &#8592;
            </button>
          </div>

          {/* Centered IntroText */}
          <div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ marginBottom: "250px", marginRight: "400px" }}
          >
            <IntroText />
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer z-30">
            <button
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % galleryimages.length)
              }
              className="bg-gray-800 p-2 rounded-full text-white"
            >
              &#8594;
            </button>
          </div>

          {/* Queue Display of Images */}
          <div className="flex items-center justify-center space-x-2 absolute bottom-8 right-8 overflow-hidden whitespace-nowrap z-30">
            {galleryimages.slice(0, queueSize).map((url, index) => (
              <motion.div
                key={index}
                className={`w-32 h-32 bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer`}
                variants={queueVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <img
                  src={url}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
            {galleryimages.length > queueSize && (
              <motion.div
                className={`w-32 h-32 bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer`}
                variants={queueVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ position: "relative", zIndex: 10 }}
              >
                <img
                  src={galleryimages[(currentIndex + 1) % galleryimages.length]}
                  alt="Next Queue Image"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
