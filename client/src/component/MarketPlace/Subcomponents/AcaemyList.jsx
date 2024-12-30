import { Card, CardContent, CardHeader } from "@mui/material";
import { Star, MapPin, BookmarkPlus } from "lucide-react";

const academies = [
  {
    id: "1",
    name: "Harmony Music Academy",
    image:
      "https://images.unsplash.com/photo-1509782642997-4befdc4b21c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Navrangpura, Ahmedabad",
    rating: 4.8,
    reviewCount: 234,
    monthlyFee: 2499,
  },
  {
    id: "2",
    name: "Classical Notes Institute",
    image:
      "https://images.unsplash.com/photo-1551696785-927d4ac2d35b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Satellite, Ahmedabad",
    rating: 4.6,
    reviewCount: 186,
    monthlyFee: 1999,
  },
  {
    id: "3",
    name: "Rhythm Music School",
    image:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Vastrapur, Ahmedabad",
    rating: 4.9,
    reviewCount: 312,
    monthlyFee: 2999,
  },
];

export default function AcademyList() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Music Academies in <span className="underline">Ahmedabad</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {academies.map((academy) => (
          <Card
            key={academy.id}
            className="overflow-hidden group relative shadow-lg rounded-lg border hover:shadow-xl"
          >
            <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
              <BookmarkPlus className="w-5 h-5 text-gray-600" />
              <span className="sr-only">Save academy</span>
            </button>
            <CardContent className="p-0">
              <div className="relative h-48">
                <img
                  src={academy.image}
                  alt={academy.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-xl mb-2 text-gray-800">
                  {academy.name}
                </h2>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{academy.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-800">
                      {academy.rating}
                    </span>
                    <span className="text-gray-500">
                      ({academy.reviewCount} reviews)
                    </span>
                  </div>
                  {academy.monthlyFee && (
                    <div className="text-sm font-medium text-green-600">
                      ₹ {academy.monthlyFee}/mo
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
