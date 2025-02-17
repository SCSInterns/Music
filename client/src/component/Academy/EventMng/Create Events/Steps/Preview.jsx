import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Divider } from "@mui/material";
import TicketBookingDialog from "../Tickets/TicketsDialog";

function Preview() {
  const formData = useSelector((state) => state.event);
  const eventid = formData.eventid || "67a3561e4fce44a72a65bbc0";
  const [preview, setPreview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEventDetails = async () => {
    if (!eventid) {
      toast.error("Please complete previous steps");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/geteventdetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: eventid }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreview(data);
      } else {
        toast.error("Error fetching event details");
      }
    } catch (error) {
      toast.error("Network error while fetching event details");
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  if (!preview) {
    return (
      <p className="text-center text-gray-600">Loading event details...</p>
    );
  }

  return (
    <div className="min-h-screen py-8">
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
          <h1 className="text-3xl font-serif font-bold text-gray-800 text-left">
            Annual Celebration - Spectrum Family
          </h1>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => setDialogOpen(true)}
          >
            Book Now
          </Button>
          <TicketBookingDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            plans={preview.plans}
          />
        </div>

        <Divider className="!my-3" />

        {/* About Event */}
        <div className="mt-6 flex flex-col md:flex-row md:space-x-10">
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700 text-left">
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

        <Divider className="pt-5" />

        {/* Event Layout */}
        {preview?.seatlayouturl && (
          <>
            <p className="text-xl my-4 font-semibold text-gray-700 !text-left">
              Event Layout:
            </p>
            <div className="my-4 flex flex-col items-center justify-center">
              <img
                src={preview.seatlayouturl}
                alt="Event Layout"
                className="mx-auto"
              />
            </div>
          </>
        )}

        <Divider className="pt-5" />

        {/* Terms and Conditions */}
        {preview?.ExtraDetailsSChema?.[0]?.termsandconditions && (
          <>
            <p className="text-xl my-4 font-semibold text-gray-700 !text-left">
              Terms and Conditions:
            </p>
            <p className="flex py-3 whitespace-pre-wrap">
              {preview.ExtraDetailsSChema[0].termsandconditions}
            </p>
          </>
        )}

        <Divider className="pt-5" />
      </div>

      <div className="flex justify-end mt-8">
        <Button variant="contained">Publish</Button>
      </div>
    </div>
  );
}

export default Preview;
