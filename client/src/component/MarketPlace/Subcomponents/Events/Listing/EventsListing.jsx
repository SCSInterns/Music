import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Calendar } from "lucide-react";
import Header from "../../Header";

const EventsPage = () => {
  // State for expandable sections
  const [dateExpanded, setDateExpanded] = useState(false);
  const [languagesExpanded, setLanguagesExpanded] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [moreFiltersExpanded, setMoreFiltersExpanded] = useState(false);

  // State for filters
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Available options
  const languages = ["English", "Hindi", "Gujarati"];
  const categories = [
    "Comedy Shows",
    "Workshops",
    "Music Shows",
    "Meetups",
    "Kids",
    "Performances",
    "Exhibitions",
    "Holi Celebrations",
  ];

  // Sample events data
  const allEvents = [
    {
      id: 1,
      title: "Aditya Gadhvi Live in Concert",
      image:
        "https://res.cloudinary.com/dipnrfd3h/image/upload/v1738918475/eventbanners/lumxjspnpnbp7rtqpauj.avif",
      promoted: true,
      category: "Music Shows",
      language: "Gujarati",
      date: "2025-02-21",
    },
    {
      id: 2,
      title: "Sonu Nigam Live in Concert",
      image:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOSBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00421828-fhkeybefek-portrait.jpg",
      promoted: true,
      category: "Music Shows",
      language: "Hindi",
      date: "2025-02-22",
    },
    {
      id: 3,
      title: "Shant Zarukhe with Manhar Udhas",
      image:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMyBGZWIgb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00420853-dknhkhprnw-portrait.jpg",
      promoted: false,
      category: "Performances",
      language: "Gujarati",
      date: "2025-02-23",
    },
    {
      id: 4,
      title: "The Voice Notes Concert",
      image:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAzMCBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00432548-cwefzauhbk-portrait.jpg",
      promoted: false,
      category: "Music Shows",
      language: "English",
      date: "2025-02-24",
    },
  ];

  // Helper function to check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const currentLocation = localStorage.getItem("location");

  // Filter events based on selected filters
  const filteredEvents = allEvents.filter((event) => {
    const dateMatch =
      !selectedDate ||
      (selectedDate === "today" &&
        event.date === new Date().toISOString().split("T")[0]) ||
      (selectedDate === "tomorrow" &&
        event.date ===
          new Date(Date.now() + 86400000).toISOString().split("T")[0]) ||
      (selectedDate === "weekend" && isWeekend(new Date(event.date)));

    const languageMatch =
      selectedLanguages.length === 0 ||
      selectedLanguages.includes(event.language);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);

    return dateMatch && languageMatch && categoryMatch;
  });

  // Handler for category selection in top bar
  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handler for language selection
  const handleLanguageClick = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedDate("");
    setSelectedLanguages([]);
    setSelectedCategories([]);
    setDateRange({ start: "", end: "" });
  };

  return (
    <>
      <Header />
      <div className="flex p-6 gap-6 bg-gray-50 min-h-screen">
        {/* Rest of the component remains the same */}
        {/* Filters Section */}
        <div className="w-72 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          </div>

          {/* Date Filter */}
          <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Date</span>
              <button
                onClick={() => setDateExpanded(!dateExpanded)}
                className="text-gray-500"
              >
                {dateExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {dateExpanded && (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      selectedDate === "today"
                        ? "bg-red-500 text-white"
                        : "border-red-500 text-red-500"
                    }`}
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev === "today" ? "" : "today"
                      )
                    }
                  >
                    Today
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      selectedDate === "tomorrow"
                        ? "bg-red-500 text-white"
                        : "border-red-500 text-red-500"
                    }`}
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev === "tomorrow" ? "" : "tomorrow"
                      )
                    }
                  >
                    Tomorrow
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      selectedDate === "weekend"
                        ? "bg-red-500 text-white"
                        : "border-red-500 text-red-500"
                    }`}
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev === "weekend" ? "" : "weekend"
                      )
                    }
                  >
                    This Weekend
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Languages Filter */}
          <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Languages</span>
              <button
                onClick={() => setLanguagesExpanded(!languagesExpanded)}
                className="text-gray-500"
              >
                {languagesExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {languagesExpanded && (
              <div className="space-y-2">
                {languages.map((language) => (
                  <label key={language} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language)}
                      onChange={() => handleLanguageClick(language)}
                      className="rounded text-red-500 focus:ring-red-500"
                    />
                    {language}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Categories Filter */}
          <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Categories</span>
              <button
                onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                className="text-gray-500"
              >
                {categoriesExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {categoriesExpanded && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryClick(category)}
                      className="rounded text-red-500 focus:ring-red-500"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            Events In {currentLocation}
          </h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategories.includes(category)
                    ? "bg-red-500 text-white border-red-500"
                    : "border-red-500 text-red-500 hover:bg-red-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="relative bg-white rounded-lg overflow-hidden shadow-md"
              >
                {event.promoted && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    PROMOTED
                  </div>
                )}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">
                      {event.language}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
