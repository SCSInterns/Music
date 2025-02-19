import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdGroups } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "Tech Expo 2024",
    location: "San Francisco, CA",
    date: "April 15, 2024",
    attendees: "5,000+ Attendees",
    image:
      "https://images.unsplash.com/photo-1619229665876-f54b2276b7bd?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Music Fest 2024",
    location: "New York, NY",
    date: "May 10, 2024",
    attendees: "10,000+ Attendees",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "AI Conference 2024",
    location: "Los Angeles, CA",
    date: "June 22, 2024",
    attendees: "3,000+ Attendees",
    image:
      "https://images.unsplash.com/photo-1619229665486-19f7ee2987a5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Startup Summit 2024",
    location: "Chicago, IL",
    date: "July 8, 2024",
    attendees: "2,500+ Attendees",
    image:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop",
  },
  {
    title: "Art & Design Expo",
    location: "Miami, FL",
    date: "August 5, 2024",
    attendees: "4,000+ Attendees",
    image:
      "https://images.unsplash.com/photo-1443186547344-2437c72a228e?q=80&w=2070&auto=format&fit=crop",
  },
];

function DomainSection() {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollElement = scrollRef.current;

    if (!container || !scrollElement) {
      console.error("Container or Scroll Element not found.");
      return;
    }

    const scrollWidth = scrollElement.scrollWidth - container.offsetWidth;

    gsap.to(scrollElement, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollWidth}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
    };
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight !float-left px-4">
          <span className="text-purple-600">| </span>
          Our Success Stories
        </h2>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-4 px-6">
          <p className="text-muted-foreground max-w-3xl text-left">
            Discover and reminisce about exciting events that took place across
            various venues. From sports to music, relive the moments that had
            something for everyone.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden relative flex flex-col lg:p-16 p-8"
      >
        <div
          ref={scrollRef}
          className="flex space-x-10 p-1 px-20 w-max h-full my-3"
          style={{ display: "flex" }}
        >
          {events.map((event, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-xl bg-black/40 h-[70vh] w-[70vw] group cursor-pointer"
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="absolute inset-0 flex flex-col justify-end bg-cover bg-center group-hover:scale-110 ease-in duration-300 p-6 text-white"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity duration-300"></div>

                <p className="text-md opacity-90 absolute top-5 left-16 backdrop-blur-lg bg-black/20 border border-purple-600 rounded-lg px-4 py-1 shadow-lg">
                  <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
                  <div className="flex items-center space-x-5">
                    <MdGroups className="mr-2" size={20} />
                    {event.attendees}
                  </div>
                </p>

                {/* Text Content */}
                <div className="relative z-10">
                  <div className="">
                    <h3 className="text-xl font-bold mb-1 float-left ml-10">
                      <span className="text-purple-600">| </span>
                      {event.title}
                    </h3>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <p className="text-sm opacity-90">
                      {" "}
                      <div className="flex items-center space-x-5">
                        <FaMapMarkerAlt className="mr-1" size={12} />
                        {event.location}
                      </div>
                    </p>

                    <p className="text-sm opacity-90">{event.date}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DomainSection;
