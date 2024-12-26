import React, { useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function SocialLinks() {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [links, setLinks] = useState({
    instagram: "",
    youtube: "",
    whatsapp: "",
    facebook: "",
    mail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks({
      ...links,
      [name]: value,
    });
  };

  const validateLink = (platform) => {
    const url = links[platform];
    switch (platform) {
      case "instagram":
        return /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/.test(url);
      case "youtube":
        return /^https?:\/\/(www\.)?youtube\.com\/(channel\/|user\/|c\/)?[A-Za-z0-9_-]+$/.test(
          url
        );
      case "whatsapp":
        return /^https?:\/\/wa\.me\/[0-9]+$/.test(url);
      case "facebook":
        return /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+$/.test(url);
      case "mail":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url); // Email validation
      default:
        return false;
    }
  };
  const handleSubmit = async () => {
    // Validate all links
    for (const platform in links) {
      if (!validateLink(platform)) {
        toast.error(`Invalid ${platform} URL!`);
        return;
      }
    }

    const data = {
      academyname: academyname,
      role: role,
      instagram: links.instagram,
      youtube: links.youtube,
      facebook: links.facebook,
      whatsapp: links.whatsapp,
      mail: links.mail,
    };

    const url =
      "https://music-academy-e32v.onrender.com/api/auth/savesociallink";
    const token = Token();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Social links saved successfully!");
        setLinks({
          instagram: "",
          youtube: "",
          facebook: "",
          whatsapp: "",
          mail: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      console.error("Error while saving social links:", error);
      toast.error(
        "An error occurred while saving social links. Please try again later."
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 500,
        margin: "auto",
        marginTop: "30px",
      }}
    >
      <Typography variant="h6" textAlign="center">
        Enter Your Social Media Links
      </Typography>

      {/* Instagram */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InstagramIcon
          fontSize="large"
          sx={{ color: "#0d1b2a", marginRight: "20px" }}
        />
        <TextField
          label="Instagram"
          name="instagram"
          value={links.instagram}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your Instagram account URL"
        />
      </Box>

      {/* YouTube */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <YouTubeIcon
          fontSize="large"
          sx={{ color: "#0d1b2a", marginRight: "20px" }}
        />
        <TextField
          label="YouTube"
          name="youtube"
          value={links.youtube}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your YouTube channel/user URL"
        />
      </Box>

      {/* WhatsApp */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WhatsAppIcon
          fontSize="large"
          sx={{ color: "#0d1b2a", marginRight: "20px" }}
        />
        <TextField
          label="WhatsApp"
          name="whatsapp"
          value={links.whatsapp}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your WhatsApp link (e.g. https://wa.me/1234567890)"
        />
      </Box>

      {/* Facebook */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FacebookIcon
          fontSize="large"
          sx={{ color: "#0d1b2a", marginRight: "20px" }}
        />
        <TextField
          label="Facebook"
          name="facebook"
          value={links.facebook}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your Facebook profile URL"
        />
      </Box>

      {/* Mail */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EmailIcon
          fontSize="large"
          sx={{ color: "#0d1b2a", marginRight: "20px" }}
        />
        <TextField
          label="Mail"
          name="mail"
          value={links.mail}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your email"
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ width: "200px", margin: "auto", backgroundColor: "#0d1b2a" }}
      >
        Save Links
      </Button>
    </Box>
  );
}

export default SocialLinks;
