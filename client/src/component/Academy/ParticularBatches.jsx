import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { toast } from "react-toastify";
import Token from "../Token/Token";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ParticularBatches() {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [thoerydays, setthoerydays] = useState([]);
  const [practical, setpracticaldays] = useState([]);
  const [customdays, setcustomdays] = useState("");
  const [id, setid] = useState("");

  const handleSubmitDays = () => {
    setSelectedBatch((prev) => ({
      ...prev,
      days: selectedDays,
    }));
    console.log("Updated days for the batch:", selectedDays);
  };

  const handlebatches = async () => {
    const token = Token();
    const url = "http://localhost:5000/api/auth/getbatchesdetails";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
      }),
    });

    if (response.ok) {
      const details = await response.json();
      setData(details);
    } else {
      toast.error("Error fetching batch details");
    }
  };

  const handleOpenModal = (batch) => {
    setSelectedBatch(batch);
    setSelectedDays([]);
    setOpen(true);
    setid(batch._id);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedBatch(null);
    setSelectedDays([]);
  };

  console.log("Selected : ", selectedBatch);

  const handleSaveChanges = async () => {
    handleSubmitDays();

    const url = "http://localhost:5000/api/auth/updatebatchdetails";
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academynameinput: academyname,
        id: id,
        role: role,
        days: selectedDays,
        startime: selectedBatch.starttime,
        endtime: selectedBatch.endtime,
        batchcoustomname: selectedBatch.batchtype,
        practicalday: practical,
        theoryday: thoerydays,
        maxstudent : customdays
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.msg || "An error occurred");
    } else {
      if (response.ok) {
        toast.success("Batch details updated");
        handleCloseModal();
        handlebatches();
        setSelectedDays([]);
      } else {
        toast.error("Error saving data");
      }
    }
  };

  const handleDayChange = (event) => {
    const { value } = event.target;
    setSelectedDays(typeof value === "string" ? value.split(",") : value);
  };

  const handleTheoryChange = (event) => {
    const { value } = event.target;
    setthoerydays(typeof value === "string" ? value.split(",") : value);
  };

  const handlePracticalChange = (event) => {
    const { value } = event.target;
    setpracticaldays(typeof value === "string" ? value.split(",") : value);
  };

  const handlestudents = (event) => {
    const { value } = event.target;
    setcustomdays(value);
  };

  useEffect(() => {
    handlebatches();
  }, []);

  return (
    <>
      <Typography variant="h6" className="mb-4">
        Step 2: Enter Particular Batch Details
      </Typography>

      <TableContainer className="shadow-lg rounded-lg mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Academy Name</TableCell>
              <TableCell>Batch Name</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((batch, index) => (
              <TableRow key={batch._id || index}>
                <TableCell>{batch.academyname}</TableCell>
                <TableCell>{batch.batchname}</TableCell>
                <TableCell>{batch.starttime}</TableCell>
                <TableCell>{batch.endtime}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(batch)}
                  >
                    View & Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Edit Batch Details</DialogTitle>
        <DialogContent>
          {selectedBatch && (
            <>
              <TextField
                label="Academy Name"
                fullWidth
                margin="dense"
                variant="outlined"
                value={selectedBatch.academyname}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Batch Name"
                fullWidth
                margin="dense"
                variant="outlined"
                value={selectedBatch.batchname}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Start Time"
                fullWidth
                margin="dense"
                variant="outlined"
                value={selectedBatch.starttime}
                type="time"
                onChange={(e) =>
                  setSelectedBatch({
                    ...selectedBatch,
                    starttime: e.target.value,
                  })
                }
              />
              <TextField
                label="End Time"
                fullWidth
                margin="dense"
                variant="outlined"
                value={selectedBatch.endtime}
                type="time"
                onChange={(e) =>
                  setSelectedBatch({
                    ...selectedBatch,
                    endtime: e.target.value,
                  })
                }
              />
              <TextField
                label="Number of Students"
                fullWidth
                margin="dense"
                variant="outlined"
                type="number"
                value={selectedBatch.noofstudents}
                InputProps={{ readOnly: true }}
              />

              {/* Custom maximum days  */}
              <TextField
                label=" Maximum Number of Students For Batch"
                fullWidth
                margin="dense"
                variant="outlined"
                type="number"
                onChange={handlestudents}
                value={customdays}
                inputProps={{ min: 0 }}
                sx={{marginBottom : '20px'}}
              />

              {/* Currentdays */}
              <TextField
                label="Current Days"
                sx={{ marginBottom: "20px" }}
                fullWidth
                margin="dense"
                variant="outlined"
                type="text"
                value={selectedBatch.days ? selectedBatch.days.join(", ") : ""}
                InputProps={{ readOnly: true }}
              />

              {/* Days Selection */}
              <Typography> Edit Select Days :</Typography>
              <Select
                label="Select Batch Days Here"
                fullWidth
                multiple
                value={selectedDays}
                onChange={handleDayChange}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                sx={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={selectedDays.includes(day)} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>

              {/* Thoery Days Selection */}
              <Typography> Edit Theory Days :</Typography>
              <Select
                label="Select Theory Batch Days Here"
                fullWidth
                multiple
                value={thoerydays}
                onChange={handleTheoryChange}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                sx={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={thoerydays.includes(day)} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>

              {/* Practical Days Selection */}
              <Typography> Edit Practical Days :</Typography>
              <Select
                label="Select Practical Batch Days Here"
                fullWidth
                multiple
                value={practical}
                onChange={handlePracticalChange}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                sx={{ marginTop: "10px", marginBottom: "10px" }}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={practical.includes(day)} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Batch Type"
                fullWidth
                margin="dense"
                variant="outlined"
                value={selectedBatch.batchtype}
                onChange={(e) =>
                  setSelectedBatch({
                    ...selectedBatch,
                    batchtype: e.target.value,
                  })
                }
              />

              {/* Display instrument types */}
              {selectedBatch.instrument_types &&
                selectedBatch.instrument_types.map((instrument, idx) => (
                  <div key={instrument._id} className="mt-4">
                    <Typography variant="subtitle1">
                      Instrument {idx + 1}
                    </Typography>
                    <TextField
                      label="Type"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      value={instrument.type}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="Quantity"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      type="number"
                      value={instrument.quantity}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      label="Current Student Count"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      type="number"
                      value={instrument.currentstudentcount}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ParticularBatches;
