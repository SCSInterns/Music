import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Eventbanner from "../../static/Images/Event_Banner.jpeg";

function Event() {
  const academyname = sessionStorage.getItem("Academy");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleEvents = async () => {
    const url = "http://localhost:5000/api/auth/getevents";

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
      setEvents(data);
    } else {
      toast.error("Events Not found");
    }
  };

  useEffect(() => {
    handleEvents();
  }, []);

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 30
      ? words.slice(0, 30).join(" ") + "..."
      : description;
  };

  const handleKnowMore = (eventId) => {
    console.log(eventId);
  };

  return (
    <>
      <Navbar />

      <div className="relative">
        <img
          src={Eventbanner}
          alt="Event Banner"
          className="w-full  object-cover"  
          style={{height : '400px'}}
        />
      </div>
      <div className="container mx-auto p-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={event.imageUrl}
                alt={event.eventname}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{event.eventname}</h2>
                <p className="mt-2 text-gray-600">
                  {truncateDescription(event.description)}
                </p>
                <button
                  onClick={() => handleKnowMore(event._id)}
                  className="mt-4 bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-950"
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Event;
