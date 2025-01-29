import React, { useState } from "react";
import { Search } from "lucide-react";
import { Tabs, Tab, Box, Button, Input } from "@mui/material";
import * as CityIcons from "../UiElements/CityIcons";
import Hero from "../../../static/Images/Hero.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const cities = [
  { name: "Mumbai", icon: <CityIcons.MumbaiIcon /> },
  { name: "Delhi", icon: <CityIcons.DelhiIcon /> },
  { name: "Bengaluru", icon: <CityIcons.BengaluruIcon /> },
  { name: "Hyderabad", icon: <CityIcons.HyderabadIcon /> },
  { name: "Ahmedabad", icon: <CityIcons.AhmedabadIcon /> },
  { name: "Chennai", icon: <CityIcons.ChennaiIcon /> },
  { name: "Kolkata", icon: <CityIcons.KolkataIcon /> },
  { name: "Pune", icon: <CityIcons.PuneIcon /> },
];

export default function CitySelector() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState(0);

  const handleserchbycity = async (city) => {
    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getacademybycity";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: city,
      }),
    });

    if (response.ok) {
      const resdata = await response.json();
      if (resdata.length > 0) {
        navigate(`/Academy`, {
          replace: true,
          state: { list: resdata, name: city },
        });
      } else {
        navigate(`/Academy`, {
          replace: true,
          state: { list: [] },
        });
      }
    } else {
      navigate(`/Academy`, {
        replace: true,
        state: { list: [] },
      });
    }
  };

  const handleSearchByPincode = async () => {
    console.log(`Searching for pincode: ${searchQuery}`);

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getnearacademy";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pincode: searchQuery,
      }),
    });

    console.log(searchQuery);

    if (response.ok) {
      const resdata = await response.json();
      if (resdata.length > 0) {
        navigate(`/Academy`, {
          replace: true,
          state: { list: resdata, name: "Near You" },
        });
      } else {
        navigate(`/Academy`, {
          replace: true,
          state: { list: resdata },
        });
      }
    } else {
      navigate(`/Academy`, {
        replace: true,
        state: { list: [] },
      });
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 bg-gray-50"
      style={{ fontFamily: "roboto-slab" }}
    >
      <div className="container relative z-10 flex flex-col mx-auto items-center">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center space-y-8 lg:space-x-8">
          {/* Left Side: Content */}
          <div className="flex-1 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
              Find Your Academy Nearby
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover top-rated academies in your city. Enter your location or
              choose from popular cities below.
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="hidden sm:block">
            <img src={Hero} alt="Hero Image" className="w-80 h-auto" />
          </div>
        </div>

        {/* Tabs for Cities */}
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          centered
          className="mt-10"
        >
          <Tab
            label="Popular Cities"
            sx={{
              color: "red",
              borderColor: "red",
            }}
          />
          <Tab
            label="Find By Pincode"
            sx={{
              color: "red",
              borderColor: "red",
            }}
          />
        </Tabs>

        {/* City Grid */}
        {value === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-10 lg:max-h-[400px] overflow-y-auto p-2 w-full justify-center">
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  handleserchbycity(city.name);
                }}
                className="flex flex-col items-center p-4 border rounded hover:bg-primary/5 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {city.icon}
                <span className="text-sm font-medium mt-3">{city.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Pincode Search Box */}
        {value === 1 && (
          <div className="mt-10 flex flex-row items-center justify-center space-x-8">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter 6-digit Pincode"
              inputProps={{ maxLength: 6 }}
              className="md:w-96 w-52 border p-2 rounded-md"
            />
            <Button
              variant="contained"
              onClick={handleSearchByPincode}
              disabled={searchQuery.length !== 6}
              sx={{ height: "40px", bgcolor: "red" }}
            >
              <Search />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
