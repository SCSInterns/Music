import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../UiElements/ImageSlider";

export function ImagesSliderDemo() {
  const images = [
    "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <>
      <div className="flex flex-wrap py-10">
        <div className="w-full md:w-1/2 p-8">
          <p
            className="text-center md:text-center font-roboto-slab mt-7 py-5 p-10 leading-10"
            style={{ fontFamily: "roboto-slab", fontSize: "20px" }}
          >
            MusicVista is your ultimate destination for exploring and connecting
            with top music academies. Whether you're a beginner or a seasoned
            musician, our platform helps you find the perfect academy tailored
            to your learning needs. We bring together the finest music
            instructors and institutions from around the world, offering courses
            that cover a wide range of instruments and genres. Discover your
            musical potential with MusicVista – where passion meets expertise.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <ImagesSlider className="h-[30rem] w-full" images={images}>
            <motion.div
              initial={{
                opacity: 0,
                y: -80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="z-50 flex flex-col justify-center items-center"
            >
              {/* You can add content inside this motion.div */}
            </motion.div>
          </ImagesSlider>
        </div>
      </div>
    </>
  );
}

export default ImagesSliderDemo;
