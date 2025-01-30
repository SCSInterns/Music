import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { motion, useAnimation } from "framer-motion";

function About() {
  const [about, setAbout] = useState({});
  const academyName = sessionStorage.getItem("Academy");
  const controls = useAnimation();
  const ref = useRef(null);

  const getAboutContent = async () => {
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/getabout";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ academyname: academyName }),
    });

    if (response.ok) {
      const data = await response.json();
      setAbout(data);
    } else {
      // toast.error("Error fetching about content");
    }
  };

  useEffect(() => {
    getAboutContent();
  }, [academyName]);

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
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants}
      className="flex p-10 items-start"
    >
      <img
        src={about.imageUrl}
        alt="About Academy"
        style={{
          width: "500px",
          height: "500px",
          padding: "40px",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2
          style={{
            color: "#0c4b65",
            textAlign: "justify",
            marginRight: "70px",
            lineHeight: "1.8",
            marginTop: "75px",
            fontSize: "18px",
            fontFamily: "ubuntu",
          }}
        >
          {about.description}
        </h2>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            bgcolor: "#0c4b65",
            color: "white",
            justifyItems: "center",
            marginTop: "20px",
            width: "150px",
          }}
        >
          Get Started
        </Button>
      </div>
    </motion.div>
  );
}

export default About;
