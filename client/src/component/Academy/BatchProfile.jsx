import React from "react";
import { Button } from "@mui/material";

function BatchProfile({ data }) {
  console.log(data);

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* <Button variant="contained" color="secondary">
            View Assigned Batch
          </Button> */}
        </div>
      </div>
    </>
  );
}

export default BatchProfile;
