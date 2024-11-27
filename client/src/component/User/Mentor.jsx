import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Core Swiper and slides
import "swiper/css"; // Import Swiper CSS
import "swiper/css/navigation"; // Import module CSS
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Team = () => {
  const academyname = sessionStorage.getItem("Academy");
  const [team, setTeam] = useState([]);

  useEffect(() => {
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
        console.error("Failed to fetch mentors");
      }
    };

    handlementors();
  }, [academyname]);

  return (
    <div
      className="h-screen"
      style={{ fontFamily: "ubuntu", marginTop: "-30px" }}
    >
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
            Our<span style={{ color: "#0c4b65" }}> Team</span>
          </h3>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {team.map((mentor, index) => (
            <SwiperSlide key={index}>
              <div className="min-w-[300px] max-w-sm mx-auto rounded overflow-hidden shadow-lg bg-white m-4">
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
                    <ul className="list-disc list-inside text-gray-600 text-sm flex flex-wrap justify-center">
                      {mentor.course.map((course, index) => (
                        <li key={index} className="mx-2">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Team;
