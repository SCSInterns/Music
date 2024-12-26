import { useState } from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, Music } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {[
        { text: "Features", href: "#features" },
        { text: "Testimonials", href: "#testimonials" },
        { text: "Pricing", href: "#pricing" },
        { text: "About Us", href: "#about" },
        { text: "Book Demo", href: "#demo" },
      ].map((item) => (
        <ListItem button key={item.text} component="a" href={item.href}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      {/* Log in Button in Drawer */}
      <ListItem button component="a" href="/admin/login">
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#0d1b2a",
            ":hover": { backgroundColor: "#ffff", color: "#0d1b2a" },
            marginTop: "1rem",
          }}
        >
          Log in
        </Button>
      </ListItem>
    </List>
  );

  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center shadow-xl justify-between bg-white supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border">
      {/* Brand Logo */}
      <a href="/business" className="flex items-center space-x-2">
        <Music className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold bg-clip-text text bg-gradient-to-r from-primary to-purple-400">
          MusicVista
        </span>
      </a>

      {/* Desktop Navigation (Visible only on Medium Screens and Larger) */}
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
          href="/"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          MarketPlace
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0d1b2a",
            ":hover": { backgroundColor: "#ffff", color: "#0d1b2a" },
          }}
        >
          <a href="/admin/login">Log in</a>
        </Button>
      </nav>

      {/* Hamburger Menu (Visible only on Small Screens) */}
      <div className="md:hidden">
        <IconButton onClick={handleDrawerToggle} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </div>
    </header>
  );
}
