import React from "react";
import { FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ShareBanner() {
  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check this out!",
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast.info("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden mt-4">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1630396617897-c0020d22bfc8?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -1,
        }}
      ></div>

      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity duration-300"></div>
      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-md md:text-3xl font-bold text-white justify-start">
              Create Unforgettable Memories with Your Friends
            </h1>
            <p className="text-white/90 text-lg text-left max-w-lg">
              Discover events that bring people together. From live concerts and
              sports matches to art exhibitions and workshops, share the
              excitement and create stories worth telling.
            </p>
          </div>

          <button
            onClick={() => {
              handleShare();
            }}
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 font-medium text-purple-500 hover:bg-white/90 transition-colors"
          >
            <FaShareAlt className="mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
