import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MusicVista - Music Academy Management Software</title>
        <meta
          name="description"
          content="Streamline your music academy operations with MusicVista. Manage classes, track student progress, and handle payments effortlessly."
        />
      </head>
      <body className={`${inter.className} bg-music-notes`}>{children}</body>
    </html>
  );
}

export default RootLayout;
