import React, { useEffect, useState } from "react";
import Header from "./Subcomponents/Header";
import Hero from "./Subcomponents/Hero";
import Cards from "./Subcomponents/Cards";
import Location from "./Subcomponents/Location";
import Works from "./Subcomponents/Works";
import FeaturesSection from "./Subcomponents/Fetures";
import Footer from "./Subcomponents/Footer";
import BannerSlideshow from "./Subcomponents/BannerSlideShow";

function Home() {
  const location = localStorage.getItem("location");
  const [data, setdata] = useState([]);

  const fetchbanners = async (cityname) => {
    const url = "http://localhost:5000/api/auth/getadvaccbycity";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city: cityname }),
    });

    if (response.ok) {
      const data = await response.json();

      setdata(data);

      console.log(data);
    }
  };

  useEffect(
    () => {
      if (location !== "") {
        fetchbanners(location);
      }
    },
    [location],
    []
  );

  const oncitychange = () => {
    setTimeout(() => {
      const city = localStorage.getItem("location");
      fetchbanners(city);
    }, 1000);
  };

  return (
    <>
      <Header onChange={oncitychange} />
      <main>
        <div>
          <section id="hero">
            {/* <Hero />  */}
            <BannerSlideshow data={data} />
          </section>

          <section id="findacademy">
            <Location />
          </section>

          <section id="academylist">
            <Cards />
          </section>

          <section id="works">
            <Works />
          </section>

          <section id="features">
            <FeaturesSection />
          </section>

          <section id="footer">
            <Footer />
          </section>
        </div>
      </main>
    </>
  );
}

export default Home;
