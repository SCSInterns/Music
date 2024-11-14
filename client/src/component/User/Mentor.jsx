import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const Team = () => {
  const academyname = sessionStorage.getItem("Academy");
  const controls = useAnimation();
  const ref = useRef(null);

  const [team, setTeam] = useState([]);

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
        } else {
          controls.start("hidden");
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

  const handlementors = async () => {
    const url = "http://localhost:5000/api/auth/getmentors";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setTeam(data);
    } else {
      // toast.error("Images Not found");
    }
  };

  useEffect(() => {
    handlementors();
  }, [academyname]);

  return (
    <>
      <motion.div
        className=" h-screen overflow-hidden"
        style={{ fontFamily: "ubuntu", marginTop: "-30px" }}
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={animationVariants}
      >
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
              Our<span style={{ color: "#0c4b65" }}> Team</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {team.map((mentor) => (
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                <img
                  className="w-full h-60 object-top object-contain"
                  src={mentor.profileimage}
                  alt={`${mentor.name}'s Profile`}
                />
                <div className="px-6 py-4">
                  <h2 className="font-bold text-xl mb-2">{mentor.name}</h2>
                  <p className="text-gray-600 text-sm">
                    Experience: {mentor.no_of_exp} + years
                  </p>
                  <div className="mt-4">
                    <p className="text-gray-800 font-semibold">Expertise :</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm flex justify-center">
                      {mentor.course.map((course, index) => (
                        <li key={index} className="mx-2">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Team;
