import React from "react";
import Header from "./Subcomponents/Header";
import Hero from "./Subcomponents/Hero";
import Cards from "./Subcomponents/Cards";
import Location from "./Subcomponents/Location";
import Works from "./Subcomponents/Works";

function Home() {
  return (
    <>
      <Header />
      <main>
        <div>
          <section id="hero">
            <Hero />
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
        </div>
      </main>
    </>
  );
}

export default Home;
