import React from "react";
import { Timeline } from "../UiElements/Timeline";
import Step1 from "../../../static/Images/step1.png";
import Step2 from "../../../static/Images/step2.png";
import Step3 from "../../../static/Images/step3.png";

export default function TimelineDemo() {
  const data = [
    {
      title: "Find Your Academy",
      content: (
        <div className="text-center md:text-left">
          <p className="text-neutral-900 text-base md:text-base font-normal mb-8 max-w-2xl mx-auto">
            Search from a curated list of top-rated academies tailored to your
            interests.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:max-w-4xl mx-auto md:ml-40">
            <div className="flex justify-center items-center">
              <img
                src={Step1}
                alt="Find Your Academy"
                className="w-full md:w-[500px] lg:w-[600px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Get Registered",
      content: (
        <div className="text-center md:text-left">
          <p className="text-neutral-900 text-base md:text-base font-normal mb-8 max-w-2xl mx-auto">
            Sign up for your favorite academy and choose a course that matches
            your passion.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:max-w-4xl mx-auto md:ml-40">
            <div className="flex justify-center items-center">
              <img
                src={Step2}
                alt="Find Your Academy"
                className="w-full md:w-[500px] lg:w-[600px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "And That's All!",
      content: (
        <div className="text-center md:text-left">
          <p className="text-neutral-900 text-base md:text-base font-normal mb-8 max-w-2xl mx-auto">
            Begin your journey of self-improvement, find the right academy, and
            start learning. It’s that simple and rewarding!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:max-w-4xl mx-auto md:ml-40">
            <div className="flex justify-center items-center">
              <img
                src={Step3}
                alt="Find Your Academy"
                className="w-full md:w-[500px] lg:w-[600px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full py-10">
      <Timeline data={data} />
    </div>
  );
}
