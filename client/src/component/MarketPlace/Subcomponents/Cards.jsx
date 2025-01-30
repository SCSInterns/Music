import { useEffect, useState } from "react";
import { FocusCards } from "../UiElements/FocusCards";

export function FocusCardsDemo() {
  const [filteracademy, setfilteracademy] = useState([]);
  const [result, setResult] = useState([]);
  const [city, setCity] = useState(localStorage.getItem("location"));

  const cards = [
    {
      academyname: "String Music Academy",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/c5/0b/ca/c50bcad94b0cc6b48f3e781d31dfa215.jpg",
    },
    {
      academyname: "Aom Music Academy",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/df/79/8d/df798d557854f0701d314421573a70ea.jpg",
    },
    {
      academyname: "Vibration Music Academy",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/19/d9/97/19d99751fad923492b810be799706c49.jpg",
    },
    {
      academyname: "House Of Rock Music Institute",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/52/43/b2/5243b20d5fa0fc0c53470f7061c94459.jpg",
    },
    {
      academyname: "Fonseca Music Academy",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/0f/d0/76/0fd076f960c94f5151a6a50d5d68f89c.jpg",
    },
    {
      academyname: "Art Enclave Studio & Music Academy",
      academycity: city,
      bannerlink:
        "https://i.pinimg.com/736x/a7/77/11/a777113773b372ff4e3d8b71576540b6.jpg",
    },
  ];

  const fetchFeaturedAcademy = async () => {
    const url =
      "https://ac26-2401-4900-1c80-453-791e-b7de-8205-4ba4.ngrok-free.app/api/auth/featuredAcademies";
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
      let data = await response.json();
      data = data.filter((item) => item !== null);
      setfilteracademy(data);
    }
  };

  useEffect(() => {
    fetchFeaturedAcademy();
  }, [city]);

  useEffect(() => {
    const combinedResult = [...filteracademy];
    if (filteracademy.length < 6) {
      const required = 6 - filteracademy.length;
      for (let i = 0; i < required; i++) {
        combinedResult.push(cards[i]);
      }
    }
    setResult(combinedResult);
  }, [filteracademy]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCity = localStorage.getItem("location");
      if (newCity !== city) {
        setCity(newCity);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [city]);

  return (
    <div className="py-20">
      <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
        Leap Into Excellence with Top Academies!
      </h2>
      <FocusCards cards={result} />
    </div>
  );
}

export default FocusCardsDemo;
