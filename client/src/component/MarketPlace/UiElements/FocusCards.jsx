import React, { useState } from "react";
import { cn } from "../../../utils/utils";

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <>
    <a href={card.websitelink} target="_blank">
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-white overflow-hidden h-80 w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
      >
        {/* Featured Badge */}
        <div className="absolute top-6 -left-6 bg-red-500 text-white text-xs md:text-sm px-8 w-fit -rotate-45 z-20">
          Featured
        </div>

        <img
          src={card.bannerlink}
          alt={card.title}
          fill
          className="object-cover absolute inset-0"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-90"
          )}
        >
          <div className="space-x-5">
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
              {card.academyname}
            </div>

            <div className="mt-2 text-l md:text-xl font-small block bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 float-right right-0">
              {card.academycity}
            </div>
          </div>
        </div>
      </div>
    </a>
  </>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.academyname}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

export default FocusCards;
