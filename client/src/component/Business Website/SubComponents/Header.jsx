import { Button } from "@mui/material";
import { Music } from "lucide-react";

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center shadow-xl  justify-between bg-white supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border">
      <a href="/business" className="flex items-center space-x-2">
        <Music className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold bg-clip-text text bg-gradient-to-r from-primary to-purple-400">
          MusicVista
        </span>
      </a>
      <nav className="hidden md:flex items-center space-x-6">
        <a
          href="#features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Features
        </a>
        <a
          href="#testimonials"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Testimonials
        </a>
        <a
          href="#pricing"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Pricing
        </a>
        <a
          href="#about"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          About Us
        </a>
        <a
          href="#demo"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Book Demo
        </a>
      </nav>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#0d1b2a",
          ":hover": { backgroundColor: "#ffff", color: "#0d1b2a" },
        }}
      >
        {" "}
        <a href="/admin/login">Log in</a>
      </Button>
    </header>
  );
}
