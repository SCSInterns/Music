import { Button } from "@mui/material";
import { AudioLines } from "lucide-react";
import ImageUi from "../../../static/Images/Ui1.png";

export default function Hero() {
  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden bg-white text-black">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
        {/* Left Column */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Manage Your Music Academy with Ease
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 opacity-90">
            Streamline operations, enhance student experiences, and orchestrate
            success with MusicVista.
          </p>
          <Button
            size="large"
            className="text-lg px-8 py-4 bg-black text-white border-2 border-transparent hover:bg-gray-800 hover:border-black transition duration-300"
            variant="outlined"
            sx={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <a href="/academyregform" target="blank">
              Start Free Trial
            </a>
          </Button>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 lg:ml-10 flex justify-center items-center">
          <img
            src={ImageUi}
            alt="Students playing various musical instruments"
            className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
            width={600}
            height={400}
          />
        </div>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <AudioLines className="w-60 h-60 text-gray-300" />
      </div>
    </section>
  );
}
