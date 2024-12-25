import React from "react";
import { Vortex } from "../UiElements/Vortex";

export default function VortexDemo() {
  return (
    <div
      className="w-full mx-auto  h-[20rem] overflow-hidden"
      style={{ fontFamily: "roboto-slab" }}
    >
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Music Vista ?
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Discover Your Perfect Music Academy – Connecting Passionate Learners
          with Expert Instructors Near You!
        </p>
      </Vortex>
    </div>
  );
}
