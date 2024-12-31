import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { Star, MapPin, BookmarkPlus, Globe, House } from "lucide-react";
import { useLocation } from "react-router-dom";
import Error from "../../../static/Images/Error.png";
import Navbar from "./Header";

export default function AcademyList() {
  const location = useLocation();

  const list = location.state?.list;

  return (
    <>
      <Navbar />

      {list.length === 0 ? (
        <>
          <div className="p-3 flex flex-col items-center justify-center min-h-screen">
            {/* Icon Button for Navigation */}
            <a href="/">
              <IconButton
                sx={{
                  position: "absolute",
                  marginTop: "5px",
                  right: 0,
                  marginRight: 1,
                  zIndex: "20",
                  backgroundColor: "#E6E6FA",
                  "&:hover": { backgroundColor: "#D8D8F4" },
                }}
              >
                <House />
              </IconButton>
            </a>

            {/* Content Area (Image + Message) */}
            <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen p-4">
              {/* Image (Error image or placeholder) */}
              <img
                src={Error}
                alt="Error"
                width={400}
                height={400}
                className="mb-4 sm:mb-0 sm:w-1/3" // Image takes 1/3 width on medium screens and up
              />

              {/* No Music Academies Found Message */}
              <div className="text-center sm:text-left sm:ml-6">
                <p className="text-3xl font-semibold text-red-500 mb-4">
                  No Music Academies found near you.
                </p>

                <a href="/" className="mb-4">
                  <button className="px-4 py-2 mt-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all">
                    Back to Home
                  </button>
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container mx-auto p-4 mt-5 relative">
            <h1 className="sm:text-3xl font-bold mb-6 text-xl">
              Music Academies <span className="text-red-500">Near You</span>
            </h1>

            <a href="/">
              <IconButton
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  marginRight: 1,
                  transform: "translateY(50%)",
                  backgroundColor: "#E6E6FA",
                  "&:hover": { backgroundColor: "#D8D8F4" },
                }}
              >
                <House />
              </IconButton>
            </a>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((academy) => (
                <Card
                  key={academy._id}
                  className="overflow-hidden group relative shadow-lg rounded-lg border hover:shadow-xl"
                >
                  <CardContent className="p-0">
                    <div className="relative w-full h-48">
                      <img
                        src={
                          academy.image
                            ? academy.image
                            : "https://images.unsplash.com/photo-1519683384663-c9b34271669a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={academy.academy_name}
                        className="object-cover w-full h-full"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <a href={academy.academy_url}>
                      <div className="p-4 md:p-4 lg:p-4">
                        <h2 className="font-semibold text-lg md:text-xl lg:text-2xl mb-4 text-gray-800">
                          {academy.academy_name}
                        </h2>
                        <div className="flex  sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-4">
                          <MapPin className="w-5 h-5 flex-shrink-0" />
                          <div className="text-center sm:text-left">
                            {`${academy.academy_city}, ${academy.academy_state} - ${academy.academy_pincode}`}
                          </div>
                        </div>
                        <div className="flex  sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-gray-500 mb-2">
                          <Globe className="w-5 h-5 flex-shrink-0" />
                          <div className="text-center sm:text-left text-red-500">
                            <a
                              href={academy.academy_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline break-all sm:break-normal"
                            >
                              {academy.academy_url.replace(/^https?:\/\//, "")
                                .length > 28
                                ? `${academy.academy_url
                                    .replace(/^https?:\/\//, "")
                                    .substring(0, 28)}...`
                                : academy.academy_url.replace(
                                    /^https?:\/\//,
                                    ""
                                  )}
                            </a>
                          </div>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
