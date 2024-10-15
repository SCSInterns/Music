import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";

function Instrument() {
  const [instruments, setInstruments] = useState([]);
  const academyname = sessionStorage.getItem("Academy");
  const navigate = useNavigate();
  const nextroute = `/${academyname}/registrationform`;
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const url = "http://localhost:5000/api/auth/getinstrument";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academyname: academyname,
          }),
        });
        const data = await response.json();

        const instrumentArray = Object.entries(data.instruments).map(
          ([label, image]) => ({
            id: Date.now() + Math.random(),
            name: label,
            imageUrl: image,
            bgColor: "bg-cyan-950",
          })
        );

        setInstruments(instrumentArray);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, [academyname]);

  const handleclick = () => {
    navigate(nextroute);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const animationVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={animationVariants} 
      >
        <p
          style={{
            textAlign: "justify",
            margin: "40px",
            marginTop: "20px",
            fontFamily: "ubuntu",
            fontSize: "18px",
            color: "#0c4b65",
          }}
        > 
          At {academyname}, we offer a wide range of musical instruments to
          inspire your musical journey. Whether you're passionate about rhythm,
          melody, or harmony, we provide personalized instruction for every
          instrument, catering to both beginners and advanced learners. From
          classical to contemporary styles, our diverse collection ensures that
          you can find the perfect instrument to express your creativity.
          Explore the selection below, each accompanied by beautiful images, and
          take the first step toward mastering your musical craft!
        </p>
      </motion.div>

      <div className="p-1 flex flex-wrap items-center justify-center">
        {instruments.map((instrument) => (
          <div
            key={instrument.id}
            className={`flex-shrink-0 m-6 relative overflow-hidden ${instrument.bgColor} rounded-lg max-w-xs shadow-lg group h-78`}
            style={{ height: "300px" }}
          >
            <svg
              className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
              viewBox="0 0 375 283"
              fill="none"
              style={{ opacity: 0.1 }}
            >
              <rect
                x="159.52"
                y="175"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 159.52 175)"
                fill="white"
              />
              <rect
                y="107.48"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 0 107.48)"
                fill="white"
              />
            </svg>
            <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                style={{
                  background: "radial-gradient(black, transparent 60%)",
                  transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                  opacity: 0.2,
                }}
              ></div>
              <img
                className="relative w-40"
                src={instrument.imageUrl}
                alt={instrument.name}
              />
            </div>
            <div className="relative text-white px-6 pb-6 mt-6">
              <span className="block opacity-75 -mb-1">
                {instrument.category}
              </span>
            </div>
            <span className="absolute left-6 bottom-6 text-white font-semibold text-xl">
              {instrument.name}
            </span>
            <button
              onClick={() => {
                handleclick();
              }}
            >
              <span
                className={`absolute right-6 bottom-6 text-white rounded-full bg-black text-xs font-bold px-3 py-2 leading-none flex items-center`}
              >
                Enroll Now
              </span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Instrument;
