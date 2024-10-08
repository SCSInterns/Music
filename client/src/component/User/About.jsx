import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

function About() {
  const [about, setabout] = useState("");
  const academyname = sessionStorage.getItem("Academy");

  const getaboutcontent = async () => {
    const url = "http://localhost:5000/api/auth/getabout";
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
      setabout(data);
    } else {
      toast.error("Error fetching about content ");
    }
  };

  useEffect(() => {
    getaboutcontent();
  }, [academyname]);

  return (
    <>
      <Navbar />
      <div className="flex p-10 items-start">
        {/* Left image */}
        <img
          src={about.imageUrl}
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
              marginRight: "30px",
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
      </div>
    </>
  );
}

export default About;
