import React from "react";
import Navbar from "./Navbar";
import Avtar from "../../static/Images/Avtar.jpeg";
import AcademyRegistration from "../Academy/DynamicForm/DynamicFormViewer";
import ScrollAnimation from "react-animate-on-scroll";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Modal from "../../../src/static/Images/Registrationmodal.svg";

function Form() {
  const academyname = sessionStorage.getItem("Academy");

  const navigate = useNavigate();

  const handleclick = async () => {
    navigate(`/${academyname}/userlogin`);
  };

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
              src={Modal}
              alt="Avatar"
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "100%",
                borderRadius: "10px",
              }}
            />
          </div>

          <div style={{ flex: 2, padding: "20px" }}>
            <AcademyRegistration academyName={academyname} Role="User" />
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "ubuntu",
                  fontSize: "15px",
                  color: "#0c4b65",
                  marginTop: "30px",
                }}
              >
                Already Registered ?{" "}
              </p>

              <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleclick();
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: "100px", backgroundColor: "#f5f5f5" }}></div>
      </ScrollAnimation>

      <Footer />
    </>
  );
}

export default Form;
