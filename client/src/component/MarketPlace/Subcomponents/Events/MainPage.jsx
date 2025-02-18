import React from "react";
import Header from "../Header";
import HeroSection from "./SubComponents/HeroSection";
import UpcomingEvents from "./SubComponents/UpcomingEvents";
import CategoriesSection from "./SubComponents/Categories";
import PastEventsSection from "./SubComponents/PastEvents";
import Footer from "../Footer";

function MainPage() {
  return (
    <>
      <Header />
      <div>
        <section>
          {" "}
          <HeroSection />{" "}
        </section>
        <section>
          {" "}
          <UpcomingEvents />{" "}
        </section>{" "}
        <section>
          <CategoriesSection />{" "}
        </section>
        <section>
          {" "}
          <PastEventsSection />{" "}
        </section>
        <section>
          {" "}
          <Footer />{" "}
        </section>
      </div>
    </>
  );
}

export default MainPage;
