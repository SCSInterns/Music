import React from "react";
import BatchManagement from "./BatchManagement";
import { useState } from "react";
import ParticularBatches from "./ParticularBatches";
import { Button } from "@mui/material";

function Batchmenu() {
  const [firststep, setfirststep] = useState(true);
  const [secondstep, setsecondstep] = useState(false);

  const handlemain = () => {
    setfirststep(true);
    setsecondstep(false);
  };

  const handlespecific = () => {
    setfirststep(false);
    setsecondstep(true);
  };

  return (
    <>
      <h1 style={{ fontWeight: "bold" }}>Create Your Academy Batches Here </h1>

      <div>
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "10px",
            display: "flex",
            marginTop: "20px",
          }}
        >
          <Button
            style={{
              backgroundColor: firststep ? "#283255" : "transparent",
              color: firststep ? "#fff" : "#000",
              border: "1px solid #ccc",
            }}
            onClick={() => handlemain()}
          >
            Insert Batch Details
          </Button>
          <Button
            style={{
              marginLeft: "10px",
              backgroundColor: secondstep ? "#283255" : "transparent",
              color: secondstep ? "#fff" : "#000",
              border: "1px solid #ccc",
            }}
            onClick={() => handlespecific()}
          >
            Add Specific Details
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {" "}
        {firststep && (
          <>
            <BatchManagement />
          </>
        )}
        {secondstep && (
          <>
            <ParticularBatches />
          </>
        )}
      </div>
    </>
  );
}

export default Batchmenu;
