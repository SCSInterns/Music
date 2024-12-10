import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "MusicVista has revolutionized how we manage our academy. It's intuitive, powerful, and saves us hours every week!",
    author: "Sarah Johnson",
    role: "Director, Harmony Music School",
  },
  {
    quote:
      "The student progress tracking feature has been a game-changer for our instructors. We can now provide much more tailored instruction.",
    author: "Michael Chen",
    role: "Lead Instructor, Crescendo Academy",
  },
  {
    quote:
      "The payment management system is flawless. No more chasing late payments or dealing with complicated billing!",
    author: "Emily Rodriguez",
    role: "Admin Manager, Rhythm Nation Institute",
  },
  {
    quote:
      "The payment management system is flawless. No more chasing late payments or dealing with complicated billing!",
    author: "Emily Rodriguez",
    role: "Admin Manager, Fine Nation Institute",
  },
  {
    quote:
      "The student progress tracking feature has been a game-changer for our instructors. We can now provide much more tailored instruction.",
    author: "Michael Chen",
    role: "Lead Instructor, Farendo Academy",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="mb-20">
              <div className="min-w-[300px] max-w-sm mx-auto h-64 rounded overflow-hidden shadow-lg bg-white p-6 flex flex-col justify-between">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="mb-4 italic line-clamp-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
