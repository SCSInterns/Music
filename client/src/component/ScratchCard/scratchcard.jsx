import { useEffect, useRef, useState } from "react";
import { useToast } from "react-toastify";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "scratchcard-js";

export default function ScratchCards() {
  const { toast } = useToast();
  const [currentCard, setCurrentCard] = useState(0);
  const containerRefs = useRef([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const cards = [
    {
      id: 1,
      image: "/images/medal.png",
      message: "Congratulations!",
      buttonColor: "bg-green-500 hover:bg-green-600",
    },
    {
      id: 2,
      image: "/images/star.png",
      message: "Congratulations!",
      buttonColor: "bg-blue-400 hover:bg-blue-500",
    },
    {
      id: 3,
      image: "/images/badge.png",
      message: "Congratulations!",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    containerRefs.current.forEach((containerRef, index) => {
      if (!containerRef) return;

      while (containerRef.firstChild) {
        containerRef.removeChild(containerRef.firstChild);
      }

      const scContainer = document.createElement("div");
      scContainer.className = "scratch-card-container";
      containerRef.appendChild(scContainer);

      const htmlBackground = document.createElement("div");
      htmlBackground.className =
        "card-content absolute inset-0 flex flex-col items-center justify-center p-6";
      htmlBackground.innerHTML = `
        <img src="${cards[index].image}" alt="Prize" class="w-32 h-32 mb-6" />
        <h3 class="text-2xl font-bold mb-6">${cards[index].message}</h3>
        <button class="${cards[index].buttonColor} text-white py-2 px-8 rounded-full font-medium">
          Share
        </button>
      `;

      const scratchCard = new ScratchCard({
        container: scContainer,
        brushSize: 30,
        finishPercent: 50,
        imageForwardSrc: "/images/scratch-overlay.png",
        imageBackgroundSrc: cards[index].image,
        htmlBackground: htmlBackground,
        clearZoneRadius: 0,
        nPoints: 30,
        pointSize: 4,
        callback: () => {
          toast({
            title: "Prize Revealed!",
            description: "You've successfully scratched the card.",
          });
        },
      });

      scratchCard
        .init()
        .then(() => {
          const canvas = scContainer.querySelector("canvas");
          if (canvas) {
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
          }
        })
        .catch((err) => {
          console.error("Error initializing scratch card:", err);
        });
    });
  }, [isClient, cards, toast]);

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-[400px] bg-white/10 rounded-3xl animate-pulse"></div>
    );
  }

  return (
    <div className="w-full max-w-6xl">
      {isMobile && (
        <div className="flex justify-between mb-4">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentCard === 0}
            className="bg-white/20 text-white"
          >
            <ChevronLeft />
          </Button>
          <div className="text-white">
            {currentCard + 1} / {cards.length}
          </div>
          <Button
            variant="outline"
            onClick={nextCard}
            disabled={currentCard === cards.length - 1}
            className="bg-white/20 text-white"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => el && (containerRefs.current[index] = el)}
            className={`
              relative w-full max-w-[300px] h-[400px] bg-white rounded-3xl shadow-xl overflow-hidden
              transition-all duration-300 transform
              ${
                isMobile
                  ? index === currentCard
                    ? "block"
                    : "hidden"
                  : "block"
              }
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}
