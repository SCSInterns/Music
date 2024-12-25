import { FocusCards } from "../UiElements/FocusCards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "String Music Academy",
      location: "Ahmedabad",
      src: "https://i.pinimg.com/736x/cd/fc/dc/cdfcdc3d6a81567e19a1d12369a746a5.jpg",
    },
    {
      title: "Aom Music Academu",
      location: "Rajkot",
      src: "https://i.pinimg.com/736x/37/24/c1/3724c16a6c530ca787fe83357c4cc90e.jpg",
    },
    {
      title: "Vibration Music Academy",
      location: "Mumbai",
      src: "https://i.pinimg.com/736x/19/d9/97/19d99751fad923492b810be799706c49.jpg",
    },
    {
      title: "House Of Rock Music Institute",
      location: "Bangalore",
      src: "https://i.pinimg.com/736x/52/43/b2/5243b20d5fa0fc0c53470f7061c94459.jpg",
    },
    {
      title: "Fonseca Music Academy",
      location: "Delhi",
      src: "https://i.pinimg.com/736x/0f/d0/76/0fd076f960c94f5151a6a50d5d68f89c.jpg",
    },
    {
      title: "Art Enclave Studio & Music Academy",
      location: "Pune",
      src: "https://i.pinimg.com/736x/a7/77/11/a777113773b372ff4e3d8b71576540b6.jpg",
    },
  ];

  return (
    <div className="py-20">
      <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
        Leap Into Excellence with Top Academies !
      </h2>
      <FocusCards cards={cards} />
    </div>
  );
}

export default FocusCardsDemo;
