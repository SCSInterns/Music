import React from "react";

// Sample events array
const events = [
  {
    id: 1,
    date: { day: 17, month: "SEP", year: 2024 },
    title: "Golf Clubbers Annual Agenda",
    location: "University of Golf Clubbers",
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b",
    price: null, // If it's sold out, set price to null
    buttonText: "GET TICKET",
    buttonDisabled: true,
  },
  {
    id: 2,
    date: { day: 16, month: "APR", year: 2024 },
    title: "Olympic Games 1st Run",
    location: "Olympic Stadium",
    imageUrl: "https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d",
    price: "£5.00",
    buttonText: "GET TICKET",
    buttonDisabled: false,
  },
  {
    id: 3,
    date: { day: 11, month: "MAR", year: 2024 },
    title: "Riga Saxophone Days",
    location: "Arena Riga",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f",
    price: "£33.00",
    originalPrice: "£48.00",
    buttonText: "GET TICKET",
    buttonDisabled: false,
  },
];

export default function UpcomingEvents() {
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
              <p className="text-muted-foreground max-w-3xl text-left">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="overflow-hidden rounded-lg shadow-lg"
              >
                <div className="relative h-48 md:h-64">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute px-3 top-4 left-4 bg-black/60 p-2 rounded-lg backdrop-blur-sm">
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold">{event.date.day}</div>
                      <div className="text-xs uppercase">
                        {event.date.month}
                      </div>
                      <div className="text-md">{event.date.year}</div>
                    </div>
                  </div>
                  {event.price && (
                    <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-lg backdrop-blur-sm">
                      <div className="text-lg font-bold text-white">
                        {event.price}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {event.location}
                  </p>
                </div>
                <div className="p-5 pt-0">
                  <button
                    className={`inline-flex w-full justify-center border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white text-black`}
                    disabled={event.buttonDisabled}
                  >
                    {event.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="md:hidden inline-flex my-7 border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white text-black">
          SEE ALL UPCOMING EVENTS
        </button>
      </section>
    </>
  );
}
