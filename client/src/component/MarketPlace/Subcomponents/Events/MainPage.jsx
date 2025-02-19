import React from "react";
import Header from "../Header";
import HeroSection from "./SubComponents/HeroSection";
import UpcomingEvents from "./SubComponents/UpcomingEvents";
import CategoriesSection from "./SubComponents/Categories";
import PastEventsSection from "./SubComponents/PastEvents";
import Cta from "./SubComponents/Cta";
import Footer from "../Footer";
import NewsletterSection from "./SubComponents/NewsLetter";

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
          <Cta />{" "}
        </section>
        <section>
          {" "}
          <NewsletterSection />{" "}
        </section>
        <section className="mt-3">
          {" "}
          <Footer />{" "}
        </section>
      </div>
    </>
  );
}

export default MainPage;
