import React, { useState } from "react";
import { toast } from "react-toastify";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted email:", email);
    const url = "http://localhost:5000/api/auth/addsubscribemail";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        location: localStorage.getItem("location") || "All",
      }),
    });

    if (response.ok) {
      toast.success("Subscribed Successfully!");
    } else {
      toast.error("Failed to Subscribe! Pls Try Again Later ");
    }

    setEmail("");
  };

  return (
    <section className="relative w-full min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 z-[-1] bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/31/73/63/317363706bfcd0de825a0f3b0c41c6af.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative h-full max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-left">
        <h2 className="text-3xl md:text-3xl font-bold text-white mb-4">
          Stay Up to Date With Your Favorite Events!
        </h2>
        <p className="text-white/90 text-base !text-ellipsis md:text-lg max-w-2xl mb-8 px-5">
          Get the latest updates on the best events happening around you. <br />
          Subscribe now and never miss out on the action!
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col md:flex-row gap-4 max-w-2xl"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your E-mail address"
            required
            className="flex-1 h-12 px-6 rounded-full border-2 border-white bg-transparent text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="h-12 px-8 rounded-full bg-white text-purple-600 font-semibold hover:bg-white/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
