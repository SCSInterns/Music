import React from "react";
import Header from "./Subcomponents/Header";
import Hero from "./Subcomponents/Hero";
import Banners from "./Subcomponents/Banners";

function Home() {
  return (
    <>
      <Header />

      <div className="">
        <Hero />
        <Banners />
      </div>
    </>
  );
}

export default Home;
