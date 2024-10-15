import React from "react";
import Navbar from "./Navbar";
import Avtar from "../../static/Images/Avtar.jpeg";
import AcademyRegistration from "../Academy/AcademyRegistration";
import ScrollAnimation from "react-animate-on-scroll";
import { motion } from "framer-motion";

function Form() {
  const academyname = sessionStorage.getItem("Academy");

  return (
    <>
      <Navbar />

      <ScrollAnimation animateIn="fadeIn">
        <div style={{ height: "50px", backgroundColor: "#f5f5f5" }}></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0",
            backgroundColor: "#f5f5f5",
            padding: "20px",
          }}
        >
          <div style={{ flex: 1, padding: "30px" }}>
            <motion.img
              initial={{ x: -100, y: 100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeIn", staggerChildren: 0.1 }}
              src={Avtar}
              alt="Avatar"
              style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
            />
          </div>

          <div style={{ flex: 2, padding: "20px" }}>
            <AcademyRegistration academyName={academyname} Role="User" />
          </div>
        </div>

        <div style={{ height: "100px", backgroundColor: "#f5f5f5" }}></div>
      </ScrollAnimation>
    </>
  );
}

export default Form;
