import React from "react";

function HeroSection() {
  return (
    <div style={{ position: "relative", width: "100%", height: "90vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470345961863-06d4b12d93b3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          clipPath: "ellipse(100% 90% at 50% 0%)",
          zIndex: -1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.4)",
          clipPath: "ellipse(100% 90% at 50% 0%)",
        }}
      ></div>
      <p className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center z-10 text-xl sm:text-xl md:text-2xl lg:text-4xl xl:text-4xl">
        MusicVista &gt; Events
      </p>
    </div>
  );
}

export default HeroSection;
