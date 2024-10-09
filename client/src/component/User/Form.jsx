import React from "react";
import Navbar from "./Navbar";
import Avtar from "../../static/Images/Avtar.jpeg";
import AcademyRegistration from "../Academy/AcademyRegistration";

function Form() {
  const academyname = sessionStorage.getItem("Academy");
  
  return (
    <>
      <Navbar />
      <div style={{ height: "50px", backgroundColor: "#f5f5f5" }}></div>

      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        margin: "0", 
        backgroundColor: "#f5f5f5", 
        padding: "20px"
      }}>
        <div style={{ flex: 1, padding: "30px" }}>
          <img src={Avtar} alt="Avatar" style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }} />
        </div>
        
        <div style={{ flex: 2, padding: "20px" }}>
          <AcademyRegistration academyName={academyname} Role="User" />
        </div>
      </div>

      <div style={{ height: "100px", backgroundColor: "#f5f5f5" }}></div>
    </>
  );
}

export default Form;
