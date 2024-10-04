import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image1 from "../../static/Images/Slider-1.jpeg";
import Image2 from "../../static/Images/Slider-2.jpeg";
import Image3 from "../../static/Images/Slider-3.jpeg";
import Image4 from "../../static/Images/Slider-4.jpeg";
import Image5 from "../../static/Images/Slider-5.jpeg";
import Image6 from "../../static/Images/Slider-6.jpeg";

import IntroText from "./IntroText";

const images = [Image1, Image2, Image3, Image4 , Image5 , Image6];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return ( 
    <>
    <div
      className="md:mt-10 md:float-right w-full md:w-1/2"
      style={{
        position: "relative",
        height: "400px",
        overflow: "hidden",
      }}
    >
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
        }}
      >
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              display:'none',
              width: "10px",
              height: "10px",
              margin: "0 5px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "white" : "gray",
              cursor: "pointer",
              opacity: index === currentIndex ? 1 : 0.7,
              transition: "opacity 0.3s",
            }}
          />
        ))}
      </div>
    </div>  

    <IntroText/>
    </>
  );
};

export default Slideshow;
