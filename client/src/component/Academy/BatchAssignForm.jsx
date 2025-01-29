import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const BatchSelectionModal = ({ open, onClose, data }) => {
  console.log(data);

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const url =
          "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/ngetbatchesdetails";
        const token = Token();
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role, academyname }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Set batch details with instruments array
        const batchDetails = data.map((batch) => ({
          id: batch._id,
          name: batch.batchname,
          instruments: batch.specificDetails?.instruments?.map(
            (instrument) => ({
              type: instrument, // Extract instrument type
            })
          ),
        }));
        setBatches(batchDetails);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, [academyname, role]);

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    setSelectedInstrument("");
  };

  const handleclose = () => {
    setSelectedInstrument("");
    setSelectedBatch("");
    onClose();
  };

  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value);
  };

  console.log(batches);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Selected Batch ID:", selectedBatch);
    console.log("Selected Instrument ID:", selectedInstrument);

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/addusertobatch";
    const token = Token();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        academyname,
        batchid: selectedBatch,
        studentid: data,
        instrumentName: selectedInstrument,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "An error occurred");
    } else {
      toast.success("Student added to batch successfully ");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleclose} maxWidth="xs" fullWidth>
      <DialogTitle>Assign User to Batch</DialogTitle>
      <DialogContent dividers>
        {/* Batch Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Batch</InputLabel>
          <Select
            value={selectedBatch}
            onChange={handleBatchChange}
            label="Select Batch"
          >
            {batches.map((batch) => (
              <MenuItem key={batch.id} value={batch.id}>
                {batch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Instrument Selection (only show if batch is selected) */}
        {selectedBatch && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Instrument</InputLabel>
            <Select
              value={selectedInstrument}
              onChange={handleInstrumentChange}
              label="Select Instrument"
            >
              <MenuItem value="None">Bring Its Own Instrument </MenuItem>
              {batches
                .find((batch) => batch.id === selectedBatch)
                ?.instruments.map((instrument) => (
                  <MenuItem key={instrument.id} value={instrument.type}>
                    {instrument.type}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleclose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchSelectionModal;
