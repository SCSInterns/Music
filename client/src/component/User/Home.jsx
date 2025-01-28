// Home.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Slider from "./Slider";
import IntroText from "./IntroText";
import Banner from "./Banner";
import About from "./About";
import Instrument from "./Instrument";
import Video from "./Video";
import Footer from "./Footer";
import Mentor from "./Mentor";
import Stats from "./Stats";

function Home() {
  const { academyname } = useParams();
  const navigate = useNavigate();
  const [verified, setverified] = useState(false);

  const verifiedurl = async () => {
    const url = `https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/checkurl`;
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
      <div className="overflow-x-hidden flex flex-col min-h-screen">
        <Navbar />

        <div className="grid grid-cols-1 gap-10">
          <section id="banner" className="h-screen">
            <Banner />
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

          <section id="stats" className="h-screen">
            <Stats />
          </section>

          <section id="mentor" className="h-screen">
            <Mentor />
          </section>
        </div>

        <Footer className="mt-auto" />
      </div>
    </>
  );
}

export default Home;
