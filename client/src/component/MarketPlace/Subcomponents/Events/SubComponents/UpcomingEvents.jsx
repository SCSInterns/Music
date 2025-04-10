import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Calendar } from "lucide-react";

export default function UpcomingEvents() {
  const [eventdata, seteventdata] = useState({});

  const fetchevents = async () => {
    const url = "http://localhost:5000/api/auth/fetcheventdetailsforusers";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const event = Object.values(data).map((item) => item);
      console.log(event);
      seteventdata(event);
    } else {
      toast.error("Error Fetching Details");
    }
  };

  useEffect(() => {
    fetchevents();
  }, []);

  console.log(eventdata);

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight float-left px-4">
        <span className="text-purple-600">| </span>
        UPCOMING EVENTS
      </h2>
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-muted-foreground md:max-w-3xl text-left float-left">
                Discover and participate in exciting events happening across
                various venues. From sports to music, we have something for
                everyone.
              </p>
            </div>
            <a href="/UpcomingEvents">
              <button className="hidden md:inline-flex border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white text-black">
                SEE ALL UPCOMING EVENTS
              </button>
            </a>
          </div>

          {eventdata?.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventdata?.length > 0 &&
                eventdata?.map((event) => (
                  <div
                    key={event.id}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <div className="relative h-48 md:h-64">
                      <img
                        src={event.banner}
                        alt={event.eventname}
                        className="object-contain w-full h-full"
                      />

                      {/* {event.price && (
                      <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-lg backdrop-blur-sm">
                        <div className="text-lg font-bold text-white">
                          {event.price}
                        </div>
                      </div>
                    )} */}
                    </div>
                    <div className="p-4 min-h-32">
                      <h3 className="text-lg font-bold mb-2 line-clamp-1 text-left">
                        {event.eventname}
                      </h3>
                      <div className="text-md font-semibold text-left flex items-center gap-3">
                        <Calendar size={16} />
                        {event.eventSchedule[0].date}
                      </div>
                      {/* <p className="text-muted-foreground text-sm">
                      {event.location}
                    </p> */}
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        className={`inline-flex w-full justify-center border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white text-black`}
                        disabled={event.buttonDisabled}
                      >
                        Get Tickets
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <button className="md:hidden inline-flex my-7 border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white text-black">
          SEE ALL UPCOMING EVENTS
        </button>
      </section>
    </>
  );
}
