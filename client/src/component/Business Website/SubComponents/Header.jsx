import { Button } from "@mui/material";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center shadow-xl  justify-between bg-white supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border">
      <Link href="/" className="flex items-center space-x-2">
        <Music className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold bg-clip-text text bg-gradient-to-r from-primary to-purple-400">
          MusicVista
        </span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="#features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="#testimonials"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Testimonials
        </Link>
        <Link
          href="#about"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          About Us
        </Link>
      </nav>
      <Button variant="contained" sx={{ backgroundColor: "#0d1b2a" }}>
        {" "}
        <a href="/academyregform" target="blank">
          Start Free Trial
        </a>
      </Button>
    </header>
  );
}
