import { Card, CardContent } from "@mui/material";
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
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 px-4 md:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="mb-4 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
