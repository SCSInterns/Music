import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Divider } from "@mui/material";

function Preview() {
  const formData = useSelector((state) => state.event);
  const eventid = formData.eventid || "67a3561e4fce44a72a65bbc0";
  const [preview, setpreview] = useState({});

  const fetchEventDetails = async () => {
    if (!eventid) {
      toast.error("Pls Complete Previous Steps");
      return;
    }

    const url = "http://localhost:5000/api/auth/geteventdetails";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: eventid,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setpreview(data);
    } else {
      toast.error("Error fetching event details");
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  return (
    <div className=" min-h-screen py-8">
      {/* Event Banner */}
      <div className="w-11/12 max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg">
        <img
          src="https://res.cloudinary.com/dipnrfd3h/image/upload/v1738918475/eventbanners/lumxjspnpnbp7rtqpauj.avif"
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Details */}
      <div className="w-11/12 max-w-5xl mx-auto mt-6 p-6 rounded-lg">
        {/* Title */}

        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800 text-left">
              Annual Celebration - Spectrum Family
            </h1>
          </div>

          <div className="float-end">
            <Button variant="contained" size="large">
              Book
            </Button>
          </div>
        </div>

        <Divider className="!my-3" />

        {/* About Event */}
        <div className="mt-6 flex flex-col md:flex-row md:space-x-10">
          <div className="md:w-1/2">
            <h2 className="text-xl  text-left font-semibold text-gray-700">
              About Event:
            </h2>
            <p className="mt-2 text-gray-600 leading-relaxed text-left whitespace-pre-wrap">
              {preview.eventdescription ||
                "Event details will be displayed here..."}
            </p>
          </div>

          {/* Venue Section */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700 text-left">
              Venue:
            </h2>
            <p className="mt-2 text-gray-600 text-left">
              Town Hall police station, Town Hall Ashram Road Opposite,
              Ellisbridge, Ahmedabad, Gujarat 380006
            </p>

            {/* Map */}
            <div className="mt-4 w-full h-64 rounded-lg overflow-hidden shadow-md border border-gray-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44750.85912734106!2d72.49563066953122!3d23.02871513510107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84568787fa65%3A0xce3a505f48ea7b09!2sTown%20Hall%2C%20Ellis%20Bridge!5e1!3m2!1sen!2sin!4v1739186905382!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {preview.seatlayouturl && (
          <div className="my-4 float-start">
            <p className="text-xl  text-left font-semibold text-gray-700">
              {" "}
              Event Layout :
            </p>

            <img
              src={preview.seatlayouturl}
              alt="Event Layout"
              className="my-auto !mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;
