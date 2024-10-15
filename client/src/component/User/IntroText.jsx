import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function IntroText() {
  const navigate = useNavigate();

  const academyname = sessionStorage.getItem("Academy") || "Your";

  const nextroute = `/${academyname}/registrationform`;

  const handlenext = () => {
    navigate(nextroute);
  };
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 10 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 1 },
    },
  };

  return (
    <>
      <div className="md:mx-auto">
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            textAlign: "justify",
            margin: "20px",
            marginTop: "200px",
            paddingLeft: "50px",
            marginRight: "100px",
            fontFamily: "ubuntu",
            color: "white",
            fontSize: "35px",
          }}
        >
          Welcome to <div></div>
          {academyname} Music Academy!
        </motion.h1>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            bgcolor: "#0c4b65",
            color: "white",
            float: "left",
            marginLeft: "70px",
            marginTop: "20px",
          }}
          onClick={() => {
            handlenext()
          }}
        >
          Get Started
        </Button>
      </div>
    </>
  );
}

export default IntroText;
