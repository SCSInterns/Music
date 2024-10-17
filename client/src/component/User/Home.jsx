// Home.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Slider from "./Slider";
import IntroText from "./IntroText";
import Gallery from "./Gallery";
import About from "./About";
import Instrument from "./Instrument";
import Video from "./Video";
import Footer from "./Footer";

function Home() {
  const { academyname } = useParams();
  const navigate = useNavigate();
  const [verified, setverified] = useState(false);

  const verifiedurl = async () => {
    const url = `http://localhost:5000/api/auth/checkurl`;
    const newurl = `http://localhost:3000/${academyname}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestedurl: newurl,
      }),
    });

    if (response.ok) {
      sessionStorage.setItem("Academy", `${academyname}`);
      setverified(true);
    } else {
      navigate("/error");
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("refreshed")) {
      sessionStorage.setItem("refreshed", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (academyname) {
      verifiedurl();
    }
  }, [academyname]);

  return (
    <>
      <div className="overflow-x-hidden">
        <Navbar />

        <section id="gallery" className="h-screen">
          <Gallery />
        </section>

        <section id="about" className="h-screen">
          <About />
        </section>

        <section id="instrument" className="h-screen">
          <Instrument />
        </section>

        <section id="video" className="h-screen">
          <Video />
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Home;
