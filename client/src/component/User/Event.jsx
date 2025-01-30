import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Eventbanner from "../../static/Images/Event_Banner.jpeg";
import Footer from "./Footer";

function Event() {
  const academyname = sessionStorage.getItem("Academy");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleEvents = async () => {
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/getevents";

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

  const handleKnowMore = async (eventId) => {
    navigate(`/${academyname}/event/${eventId}`);
  };

  return (
    <>
      <Navbar />

      <div className="relative">
        <img
          src={Eventbanner}
          alt="Event Banner"
          className="w-full  object-cover"
          style={{ height: "400px" }}
        />
      </div>

      <h1
        style={{
          fontFamily: "ubuntu",
          margin: "20px",
          fontSize: "20px",
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        Our Recent Event's
      </h1>
      <div className="container mx-auto p-4 mt-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={event.imageUrl}
                alt={event.eventname}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold">{event.eventname}</h2>
                <p className="mt-2 text-gray-600 flex-grow">
                  {truncateDescription(event.description)}
                </p>
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => handleKnowMore(event._id)}
                    className="mt-auto bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-950"
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Event;
