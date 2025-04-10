import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Divider, Grid, Tooltip, Typography } from "@mui/material";
import TicketBookingDialog from "../Tickets/TicketsDialog";
import { Armchair } from "lucide-react";

function Preview() {
  const formData = useSelector((state) => state.event);
  // const eventid = formData.eventid;
  const eventid = "67ef6bd50b2baf0a97f67bf6";
  const [preview, setPreview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  let seatnumbet = 1;

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

  console.log(preview);

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
          {preview?.seatlayouturl && (
            <>
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
            </>
          )}
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
            {preview?.event?.eventSchedule?.length > 0 && (
              <div className="">
                <h2 className="text-xl font-semibold text-gray-700 text-left">
                  Event Schedule:
                </h2>
                <div className="mt-2 space-y-4">
                  {preview.event.eventSchedule.map((schedule, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-md bg-gray-50 text-left"
                    >
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {schedule.date}
                      </p>
                      <p>
                        <span className="font-medium">Start Time:</span>{" "}
                        {schedule.startTime}
                      </p>
                      <p>
                        <span className="font-medium">End Time:</span>{" "}
                        {schedule.endTime}
                      </p>

                      {schedule.venuedetails?.name && (
                        <p>
                          <span className="font-medium">Venue:</span>{" "}
                          {schedule.venuedetails.name}
                        </p>
                      )}

                      {/* You can show more venue info like address if needed */}
                      {schedule.venuedetails?.address && (
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {schedule.venuedetails.address}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-700 text-left my-2">
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

        {preview?.seatlayout && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 text-left my-2">
              Event Layout:
            </h2>
            <div className="overflow-auto">
              <Grid
                container
                spacing={2}
                direction="column"
                sx={{ mt: 3, ml: 4 }}
              >
                <div className="flex flex-col items-center justify-start">
                  <p>All eyes this way</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 50"
                    width="300"
                    height="100"
                  >
                    <path
                      d="M10 25 Q50 0, 90 25"
                      fill="transparent"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {Array.isArray(preview.seatlayout.planlayout) &&
                  Array.from(
                    new Set(
                      preview.seatlayout.planlayout.map((plan) => plan.planName)
                    )
                  ).map((planName) => (
                    <div key={planName} style={{ marginBottom: "20px" }}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          mt: 2,
                          color: "grey",
                          fontSize: "14px",
                        }}
                      >
                        Rs.{" "}
                        {
                          preview.seatlayout.planlayout.find(
                            (p) => p.planName === planName
                          )?.pricePerSeat
                        }{" "}
                        {planName.toUpperCase()}{" "}
                      </Typography>
                      <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
                      {preview.seatlayout.seatsPerPartition
                        .map((row, rowIndex) => ({ row, rowIndex }))
                        .filter(
                          ({ rowIndex }) =>
                            preview.seatlayout.planlayout[rowIndex]
                              ?.planName === planName
                        )
                        .map(({ row, rowIndex }) => (
                          <div key={rowIndex}>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: 5,
                                mt: 2,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {preview.seatlayout.seatingorientation ===
                                "Ascending"
                                  ? String.fromCharCode(rowIndex + 65)
                                  : String.fromCharCode(
                                      65 +
                                        (Number(preview.seatlayout.noofrows) -
                                          1 -
                                          rowIndex)
                                    )}
                              </Typography>

                              {row.map((seatCount, partitionIndex) => (
                                <Grid
                                  item
                                  key={`${rowIndex}-${partitionIndex}`}
                                  sx={{
                                    width: `${
                                      preview.seatlayout.maxSeatsPerPartition[
                                        partitionIndex
                                      ] * 30
                                    }px`,
                                    minWidth: "70px",
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                    justifyContent:
                                      partitionIndex % 2 !== 0
                                        ? "flex-start"
                                        : "flex-end",
                                  }}
                                >
                                  {Array.from({
                                    length: Number(seatCount),
                                  }).map((_, i) => (
                                    <Tooltip
                                      key={`${rowIndex}-${partitionIndex}-${i}`}
                                      title={`${String.fromCharCode(
                                        rowIndex + 65
                                      )}- P${partitionIndex + 1} - Seat ${
                                        i + 1
                                      }`}
                                    >
                                      <Armchair
                                        style={{
                                          color: "#4caf50",
                                          cursor: "pointer",
                                          width: "18px",
                                          height: "18px",
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          marginTop: "2px",
                                          color: "#555",
                                        }}
                                      >
                                        {seatnumbet++}{" "}
                                        {/* Display the continuous seat number */}
                                      </span>
                                    </Tooltip>
                                  ))}
                                </Grid>
                              ))}
                            </Grid>
                          </div>
                        ))}
                    </div>
                  ))}
              </Grid>
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

        {preview?.event && (
          <>
            {/* Event Date & Time */}
            {(preview.event.date ||
              preview.event.startTime ||
              preview.event.endTime) && (
              <div className="my-4">
                <p className="text-xl font-semibold text-gray-700 !text-left mb-2">
                  Event Timing:
                </p>
                <div className="text-left space-y-1">
                  {preview.event.date && (
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {preview.event.date}
                    </p>
                  )}
                  {preview.event.startTime && (
                    <p>
                      <span className="font-medium">Start Time:</span>{" "}
                      {preview.event.startTime}
                    </p>
                  )}
                  {preview.event.endTime && (
                    <p>
                      <span className="font-medium">End Time:</span>{" "}
                      {preview.event.endTime}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Coupons */}
            {preview.event.coupon?.length > 0 && (
              <div className="my-4">
                <p className="text-xl font-semibold text-gray-700 !text-left mb-2">
                  Available Coupons:
                </p>
                <ul className="space-y-2 text-left">
                  {preview.event.coupon.map((c, i) => (
                    <li
                      key={i}
                      className="p-3 border border-gray-300 rounded-md bg-gray-50"
                    >
                      <p>
                        <span className="font-medium">Name:</span> {c.name}
                      </p>
                      <p>
                        <span className="font-medium">Discount:</span> ₹
                        {c.discount}
                      </p>
                      <p>
                        <span className="font-medium">Tickets:</span>{" "}
                        {c.tickets}
                      </p>
                      <p>
                        <span className="font-medium">Expiry:</span>{" "}
                        {c.expirydate}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Group Discounts */}
            {preview.event.groupdiscount?.length > 0 && (
              <div className="my-4">
                <p className="text-xl font-semibold text-gray-700 !text-left mb-2">
                  Group Discounts:
                </p>
                <ul className="space-y-2 text-left">
                  {preview.event.groupdiscount.map((g, i) => (
                    <li
                      key={i}
                      className="p-3 border border-gray-300 rounded-md bg-gray-50"
                    >
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {g.couponName ? g.couponName : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Minimum Tickets:</span>{" "}
                        {g.MinimumTickets}
                      </p>
                      <p>
                        <span className="font-medium">Discount:</span> ₹
                        {g.Discount}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
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
