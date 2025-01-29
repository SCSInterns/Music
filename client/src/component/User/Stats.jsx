import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const StatsSection = () => {
  const [data, setData] = useState({
    students_enroll: 0,
    instrument_course_offered: 0,
    Certified_Instructors: 0,
    Years_of_Operation: 0,
  });
  const [visible, setVisible] = useState(false);

  const academyname = sessionStorage.getItem("Academy");
  const controls = useAnimation();
  const ref = useRef(null);

  const animationVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          setVisible(true);
        } else {
          controls.start("hidden");
          setVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const fetchstatsdetails = async () => {
    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getstats";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ academyname }),
    });

    if (response.ok) {
      const result = await response.json();
      setData({
        students_enroll: result.students_enroll,
        instrument_course_offered: result.instrument_cousre_offered,
        Certified_Instructors: result.Certified_Instructors,
        Years_of_Operation: result.Years_of_Operation,
      });
    } else {
      console.error("Failed to fetch data");
    }
  };

  const animateCountUp = (id, targetCount, suffix = "") => {
    let currentCount = 0;
    const increment = targetCount < 100 ? 1 : Math.ceil(targetCount / 100);

    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        clearInterval(interval);
        currentCount = targetCount;
      }
      document.getElementById(id).textContent = currentCount + suffix;
    }, 20);
  };

  useEffect(() => {
    fetchstatsdetails();
  }, [academyname]);

  useEffect(() => {
    if (visible) {
      animateCountUp("students_enroll", data.students_enroll, "+");
      animateCountUp(
        "instrument_course_offered",
        data.instrument_course_offered,
        "+"
      );
      animateCountUp("Certified_Instructors", data.Certified_Instructors);
      animateCountUp("Years_of_Operation", data.Years_of_Operation, "+");
    }
  }, [visible, data]);

  return (
    <div className="h-screen overflow-hidden" style={{ fontFamily: "ubuntu" }}>
      <div className="pt-12 sm:pt-20">
        <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold leading-9 text-gray-900 sm:text-4xl sm:leading-10">
              Trusted by Musicians
            </h2>
            <p className="mt-3 text-xl leading-7 text-gray-600 dark:text-gray-400 sm:mt-4">
              Join a community of aspiring and passionate musicians.
            </p>
          </div>
        </div>
        <motion.div
          className="pb-12 mt-10 sm:pb-16 h-screen"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={animationVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 h-1/2"></div>
            <div className="relative max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <dl className="bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:grid sm:grid-cols-2 lg:grid-cols-4">
                  {Object.keys(data).map((key) => (
                    <div
                      key={key}
                      className="flex flex-col p-6 text-center border-t border-gray-100 dark:border-gray-700 sm:border-0 sm:border-l"
                    >
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 dark:text-gray-400">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd
                        className="order-1 text-5xl font-extrabold leading-none text-indigo-600 dark:text-indigo-100"
                        id={key}
                      >
                        0
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsSection;
