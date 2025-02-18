import { useEffect, useState } from "react";
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Divider,
} from "@mui/material";
import { LocateFixedIcon, MapPin, Menu as MenuIcon, Music } from "lucide-react";
import * as CityIcons from "../UiElements/CityIcons";
import { toast } from "react-toastify";
import { use } from "react";

export default function Header({ onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const cities = [
    { name: "Mumbai", icon: <CityIcons.MumbaiIcon /> },
    { name: "Delhi", icon: <CityIcons.DelhiIcon /> },
    { name: "Bengaluru", icon: <CityIcons.BengaluruIcon /> },
    { name: "Hyderabad", icon: <CityIcons.HyderabadIcon /> },
    { name: "Ahmedabad", icon: <CityIcons.AhmedabadIcon /> },
    { name: "Chennai", icon: <CityIcons.ChennaiIcon /> },
    { name: "Kolkata", icon: <CityIcons.KolkataIcon /> },
    { name: "Pune", icon: <CityIcons.PuneIcon /> },
  ];

  const fetchCurrentLocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data) {
              setLocation(data.address.state_district);
              onChange();
              setDialogOpen(false);
            } else {
              toast.error("Unable to fetch your city. Please try again.");
            }
          } catch (error) {
            console.error("Error fetching city:", error);
            toast.error("An error occurred while fetching your city.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          toast.error("Unable to fetch your location. Please try again.");
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location !== "") {
      localStorage.setItem("location", location);
    }
  }, [location]);

  useEffect(() => {
    if (location === "") {
      const setttedlocation = localStorage.getItem("location");
      setLocation(setttedlocation);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!location) {
        handleDialogOpen();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [location, handleDialogOpen]);

  const drawer = (
    <List>
      {[
        { text: "Find Academy", href: "#findacademy" },
        { text: "Academy", href: "#academylist" },
        { text: "Events", href: "/Event" },
        { text: "Pricing", href: "#pricing" },
        { text: "About Us", href: "/About" },
        { text: "Features", href: "#fetures" },
        { text: "Register Your Academy", href: "/business" },
      ].map((item) => (
        <ListItem button key={item.text} component="a" href={item.href}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 flex items-center shadow-xl justify-between bg-white supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border">
      {/* Brand Logo */}
      <a href="/" className="flex items-center space-x-2">
        <Music className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold bg-clip-text text bg-gradient-to-r from-primary to-purple-400">
          MusicVista
        </span>
      </a>

      {/* Search Bar */}
      <div className=" lg:flex items-center md:hidden">
        <div className="hidden sm:w-36 sm:flex md:w-48 lg:w-72">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search location"
            onClick={handleDialogOpen}
            InputProps={{
              startAdornment: <MapPin className="mr-2 text-gray-500" />,
              readOnly: true,
            }}
            value={location}
          />
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6">
        <a
          href="#findacademy"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Find Academy
        </a>
        <a
          href="#academylist"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Academy
        </a>
        <a
          href="/Event"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Events
        </a>
        <a
          href="/About"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          About Us
        </a>
        <a
          href="#features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Features
        </a>
        <a
          href="/Business"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Register Your Academy
        </a>
      </nav>

      {/* Hamburger Menu */}
      <div className="lg:hidden">
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
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search location"
            onClick={handleDialogOpen}
            InputProps={{
              startAdornment: <MapPin className="mr-2 text-gray-500" />,
              readOnly: true,
            }}
            value={location}
            className="!py-3 !px-2"
          />
          <Divider className="py-1" />
          {drawer}
        </Drawer>
      </div>

      {/* Location Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Select Your Location
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchCurrentLocation}
            className="md:mt-4 md:float-right !mt-5  "
            disabled={loading}
          >
            <LocateFixedIcon className="mr-2 w-5 h-5 text-blue" />
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Use Current Location"
            )}
          </Button>
        </DialogTitle>
        <DialogContent>
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:mt-10 mt-4 lg:max-h-[400px] 
           !overflow-y-hidden p-2 w-full justify-center"
          >
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  setLocation(city.name);
                  onChange();
                  setDialogOpen(false);
                }}
                className="flex flex-col items-center md:p-4 p-2 border rounded hover:bg-primary/5 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {city.icon}
                <span className="text-sm font-medium mt-3">{city.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(`Location selected: ${location}`);
              handleDialogClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}
