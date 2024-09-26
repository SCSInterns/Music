// Home.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from './Navbar'

function Home() {
  const { academyname } = useParams();
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
      toast.success("Academy Url : Right ");
      sessionStorage.setItem("Academy", `${academyname}`)
      setverified(true);
    } else {
      toast.error("Academy Url : Wrong ");
    }
  };

  useEffect(() => {
    if (academyname) {
      verifiedurl();
    }
  }, [academyname]);

  return (
    <>
      <Navbar/>
    </>
  );
}

export default Home;
