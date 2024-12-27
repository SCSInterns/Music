import React from "react";
import Header from "./Subcomponents/Header";
import Banners from "./Subcomponents/Banners";
import ContactPage from "./Subcomponents/ContactPage";

function Aboutpage() {
  return (
    <>
      <Header />

      <div>
        <Banners />
      </div>

      <div>
        <ContactPage />
      </div>
    </>
  );
}

export default Aboutpage;
