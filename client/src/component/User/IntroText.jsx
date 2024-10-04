import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

function IntroText() {
  const academyname = sessionStorage.getItem("Academy") || "Your";

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 1 },
    },
  };

  return (
    <>
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
          marginRight:'20px',
          fontFamily: "ubuntu",
          color: "#0c4b65",
          fontSize: "35px",
        }}
      >
        Welcome to {academyname} Music Academy!
      </motion.h1>

      <Button
        variant="contained"
        color="secondary"
        sx={{ bgcolor: "#0c4b65", color:'white' , float: "left", marginLeft: "70px" , marginTop: '20px'}}
      >
        Get Started
      </Button>
    </>
  );
}

export default IntroText;
