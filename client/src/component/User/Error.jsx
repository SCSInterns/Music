import React from "react";
import Error2 from "../../static/Images/Error-2.jpeg";

function Error() {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src={Error2}
          alt="Error"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: "-1",
          }}
        />
      </div>
    </>
  );
}

export default Error;
