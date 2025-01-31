import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
  MenuItem,
} from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const AdvertiseForm = () => {
  const role = sessionStorage.getItem("role");

  const [formData, setFormData] = useState({
    role: role,
    name: "",
    price: "",
    limit: "",
    section: "",
    features: [],
  });

  const token = Token();

  const [featureInput, setFeatureInput] = useState("");

  const staticSections = ["Banner", "Events", "Featured"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureInput = (e) => {
    setFeatureInput(e.target.value);
  };

  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/newentry";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Advertise created successfully!");
        setFormData({
          name: "",
          price: "",
          limit: "",
          section: "",
          features: [],
        });
      } else {
        toast.error("Error creating advertise.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to make the API call.");
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Create Advertise Template
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mx: 3,
          mt: 4,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* First Row: Name and Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price per month"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              type="number"
              required
            />
          </Grid>

          {/* Second Row: Limit and Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Limit per month"
              name="limit"
              value={formData.limit}
              onChange={handleInputChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Section in marketplace"
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              required
            >
              {staticSections.map((section, index) => (
                <MenuItem key={index} value={section}>
                  {section}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Third Row: Features */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Add Feature"
              value={featureInput}
              onChange={handleFeatureInput}
              placeholder="Enter a feature and click Add"
            />
            <Button
              variant="outlined"
              onClick={handleAddFeature}
              sx={{ mt: 1, float: "right" }}
            >
              Add Feature
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box>
              {formData.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => handleRemoveFeature(feature)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        {/* Submit Button */}
        <Box mt={5}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ float: "right" }}
            disabled={
              formData.limit === "" ||
              formData.features.length === 0 ||
              formData.name === "" ||
              formData.price === "" ||
              formData.section === ""
            }
          >
            Create Advertisement
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AdvertiseForm;
