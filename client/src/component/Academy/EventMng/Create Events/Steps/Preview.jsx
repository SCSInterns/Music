import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Divider } from "@mui/material";
import TicketBookingDialog from "../Tickets/TicketsDialog";

function Preview() {
  const formData = useSelector((state) => state.event);
  const eventid = formData.eventid;
  const [preview, setPreview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlesubmit = async () => {
    const url = "http://localhost:5000/api/auth/publishevent";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("accesstoken")}`,
      },
      body: JSON.stringify({
        id: eventid,
        role: `${sessionStorage.getItem("role")}`,
      }),
    });

    if (response.ok) {
      toast.success("Event published successfully");
    } else {
      toast.error("Error publishing event");
    }
  };

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
          src={preview.event.banner}
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Details */}
      <div className="w-11/12 max-w-5xl mx-auto mt-6 p-6 rounded-lg">
        {/* Title */}
        <div className="flex justify-between">
          <h1 className="text-3xl font-serif font-bold text-gray-800 text-left">
            {preview.event.eventname}
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
            plans={preview.event.plans}
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
              {preview.event.eventdescription ||
                "Event details will be displayed here..."}
            </p>
          </div>

          {/* Venue Section */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700 text-left">
              Venue:
            </h2>
            <p className="mt-2 text-gray-600 text-left">
              {preview.venuedetails.venuename},{preview.venuedetails.city},
              {preview.venuedetails.state}-{preview.venuedetails.pincode}
            </p>

            {/* Map */}
            <div className="mt-4 w-full h-64 rounded-lg overflow-hidden shadow-md border border-gray-300">
              <iframe
                src={preview.venuedetails.maplink}
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
                src={preview.event.seatlayouturl}
                alt="Event Layout"
                className="mx-auto"
              />
            </div>
          </>
        )}

        <Divider className="pt-5" />

        {/* Terms and Conditions */}
        {preview?.event?.ExtraDetailsSChema?.[0]?.termsandconditions && (
          <>
            <p className="text-xl my-4 font-semibold text-gray-700 !text-left">
              Terms and Conditions:
            </p>
            <p className="flex py-3 whitespace-pre-wrap text-left">
              {preview.event.ExtraDetailsSChema[0].termsandconditions}
            </p>
          </>
        )}

        <Divider className="pt-5" />
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={() => handlesubmit()} variant="contained">
          Publish
        </Button>
      </div>
    </div>
  );
}

export default Preview;
