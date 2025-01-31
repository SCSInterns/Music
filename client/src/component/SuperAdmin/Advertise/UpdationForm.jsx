import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const UpdateAdvertiseDialog = ({ open, initialData, onClose, onUpdate }) => {
  console.log(initialData);
  const token = Token();
  const role = sessionStorage.getItem("role");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    limit: "",
    section: "",
    features: [],
    id: initialData._id,
    role: role,
  });

  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        limit: initialData.limit,
        section: initialData.section,
        features: initialData.features,
        id: initialData._id,
        role: role,
      });
    }
  }, [initialData]);

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

    try {
      const url =
        "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/updateentry";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Advertise updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error("Error updating advertise.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update the advertisement.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Advertise</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
          }}
        >
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Limit"
            name="limit"
            value={formData.limit}
            onChange={handleInputChange}
            type="number"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <Box mt={2}>
            <TextField
              fullWidth
              label="Add Feature"
              value={featureInput}
              onChange={handleFeatureInput}
              margin="normal"
            />
            <Button
              variant="outlined"
              onClick={handleAddFeature}
              sx={{ mt: 1, mb: 2 }}
            >
              Add Feature
            </Button>

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
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAdvertiseDialog;
