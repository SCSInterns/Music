import React from "react";

function Video() {
  return (
    <>
      <div style={{ position: "relative", marginBottom: "50px" }}>
        <div
          className="pattern-dots pattern-indigo-900 pattern-bg-white pattern-size-8 pattern-opacity-80"
          style={{
            width: "200px",
            height: "200px",
            position: "absolute",
            top: "-250px",
            left: "10px",
            zIndex: "1", 
          }}
        ></div>
      </div>
      <div
        className="flex justify-center items-center p-4"
        style={{ marginTop: "100px", display: "flex", flexDirection: "column" }}
      >
        {/* Outer Box Container */}
        <div
          style={{
            backgroundColor: "#0c4b65",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            width: "1000px", 
            height: "50%", 
            margin: "auto",
            position: "relative",
            zIndex: "2", 
          }}
        >
          {/* Video Container */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
            <iframe
              className="h-80"
              style={{
                height: "400px",
                width: "100%", 
                zIndex: "10",
                border: "none",
              }}
              src="https://www.youtube.com/embed/khUaF36F_SY"
              title="YouTube Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default Video;
