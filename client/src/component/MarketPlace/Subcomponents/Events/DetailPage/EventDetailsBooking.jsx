import React from "react";
import { Calendar, Clock, MapPin, Share2, ChevronRight } from "lucide-react";
import Header from "../../Header";

const EventDetailPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl overflow-hidden">
            <img
              src="https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-aditya-gadhvi-live-in-concert-ahmedabad-0-2025-2-4-t-8-35-25.jpg"
              alt="Event"
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                DangerousAlias Conference 2025
              </h1>
              <p className="text-gray-600 text-left">
                Influential media, entertainment & technology show inspirational
                speakers including game-changing, not just a large-scale
                conference, but a large educational hub on digital technology
                for business, where people communicate, and are inspired to find
                ready-made solutions for business.
              </p>
            </div>

            <div className="space-y-4 py-4 border-y border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium">
                    September 5, 2025 - September 12, 2025
                  </p>
                  <p className="text-sm text-gray-500 text-left">
                    Add to calendar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium">10:00 am - 10:00 pm</p>
                  <p className="text-sm text-gray-500 text-left">
                    (Asia/Dhaka)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium text-left">Chicago</p>
                  <p className="text-sm text-gray-500">United States</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex-1">
                Book Tickets
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="shadow-md py-4 p-2">
              <h2 className="text-2xl font-bold mb-4">Event Information</h2>
              <p className="text-gray-600 text-left mx-4">
                Taking place over two days this year will be the 10th Conference
                Ideas with a theme of DangerousAlias. It features sessions
              </p>
            </section>

            <section className="shadow-md py-4 p-2">
              <h2 className="text-2xl font-bold mb-4">Event About</h2>
              <div className="space-y-4 text-left mx-2">
                <p className="text-gray-600">
                  Are you a founder that is building a new better future for
                  women?
                </p>
                <p className="text-gray-600">
                  Are you working with another co-founder or considering finding
                  one?
                </p>
                <p className="text-gray-600">
                  Learn how to build a co-founder relationship more effectively
                  at the virtual event!
                </p>
              </div>

              <div className="mt-6  text-left  mx-2 ">
                <h3 className="font-semibold mb-2">Topics include:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Creating a co-founder agreement</li>
                  <li>Importance of defined roles</li>
                  <li>Creating a co-founder agreement</li>
                  <li>Importance of defined roles</li>
                </ul>
              </div>
            </section>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold">Add To Calendar</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50">
                  <span className="font-medium">Google</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50">
                  <span className="font-medium">Yahoo</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50">
                  <span className="font-medium">Apple</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50">
                  <span className="font-medium">Outlook</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
