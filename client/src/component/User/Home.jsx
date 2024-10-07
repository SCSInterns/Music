// Home.js
import React, { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Slider from "./Slider";
import IntroText from "./IntroText";

function Home() {
  const { academyname } = useParams();
  const navigate = useNavigate()
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
      navigate('/error')
    }
  };

  useEffect(() => {
    if (academyname) {
      verifiedurl();
    }
  }, [academyname]);

  return (
    <>
      <Navbar />
      <Slider />
    </>
  );
}

export default Home;
