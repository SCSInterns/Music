import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Checkbox,
  ListItemText,
  FormControlLabel,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const courseOptions = {
  Music: ["Guitar", "Drum", "Piano", "Violin"],
  Singing: ["Classical", "Pop", "Rock", "Folk"],
  Dancing: ["Ballet", "Hip-Hop", "Salsa", "Contemporary"],
  Art: ["Painting", "Sculpture", "Sketching", "Pottery"],
};

const BatchDetailsForm = () => {
  const [formData, setFormData] = useState({
    academyname: "",
    batchname: "",
    maximumstudents: "",
    course: "",
    specificDetails: [],
    classtype: "",
    sameTimeForSelectedDays: false,
    selectedDays: [],
    globalStartTime: "",
    globalEndTime: "",
    globalClassType: "",
    schedule: [],
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScheduleChange = (day, type, value) => {
    const updatedSchedule = formData.schedule.map((item) =>
      item.day === day ? { ...item, [type]: value } : item
    );
    const dayExists = formData.schedule.some((item) => item.day === day);

    if (!dayExists) {
      updatedSchedule.push({
        day,
        starttime: "",
        endtime: "",
        classtype: "",
      });
    }

    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = () => {
    const submissionData = formData.sameTimeForSelectedDays
      ? {
          ...formData,
          schedule: daysOfWeek.map((day) =>
            formData.selectedDays.includes(day)
              ? {
                  day,
                  starttime: formData.globalStartTime,
                  endtime: formData.globalEndTime,
                  classtype: formData.globalClassType,
                }
              : formData.schedule.find((item) => item.day === day) || {
                  day,
                  starttime: "",
                  endtime: "",
                  classtype: "",
                }
          ),
        }
      : formData;

    console.log("Submitted Data: ", submissionData);
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Batch Details Form
      </Typography>

      <TextField
        fullWidth
        label="Batch Name"
        value={formData.batchname}
        onChange={(e) => handleChange("batchname", e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type="number"
        label="Maximum Students"
        value={formData.maximumstudents}
        onChange={(e) => handleChange("maximumstudents", e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          value={formData.course}
          onChange={(e) => handleChange("course", e.target.value)}
        >
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Singing">Singing</MenuItem>
          <MenuItem value="Dancing">Dancing</MenuItem>
          <MenuItem value="Art">Art</MenuItem>
        </Select>
      </FormControl>

      {formData.course && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="specific-details-label">
            {`Select ${formData.course} Options`}
          </InputLabel>
          <Select
            labelId="specific-details-label"
            multiple
            value={formData.specificDetails}
            onChange={(e) => handleChange("specificDetails", e.target.value)}
            renderValue={(selected) => selected.join(", ")}
          >
            {courseOptions[formData.course]?.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={formData.specificDetails.includes(option)} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.sameTimeForSelectedDays}
            onChange={(e) =>
              handleChange("sameTimeForSelectedDays", e.target.checked)
            }
          />
        }
        label="Same Time for Selected Days"
      />

      {formData.sameTimeForSelectedDays && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="selected-days-label">Select Days</InputLabel>
            <Select
              labelId="selected-days-label"
              multiple
              value={formData.selectedDays}
              onChange={(e) => handleChange("selectedDays", e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={formData.selectedDays.includes(day)} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TimePicker
                label="Start Time"
                onChange={(value) =>
                  handleChange("globalStartTime", value?.format("HH:mm"))
                }
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
              <TimePicker
                label="End Time"
                onChange={(value) =>
                  handleChange("globalEndTime", value?.format("HH:mm"))
                }
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel id="global-class-type-label">Class Type</InputLabel>
            <Select
              labelId="global-class-type-label"
              value={formData.globalClassType}
              onChange={(e) => handleChange("globalClassType", e.target.value)}
            >
              <MenuItem value="Practical">Practical</MenuItem>
              <MenuItem value="Theory">Theory</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {!formData.sameTimeForSelectedDays &&
        daysOfWeek.map((day) => (
          <Box
            key={day}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            <Checkbox
              checked={formData.schedule.some((item) => item.day === day)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleScheduleChange(day, "day", day);
                } else {
                  setFormData({
                    ...formData,
                    schedule: formData.schedule.filter(
                      (item) => item.day !== day
                    ),
                  });
                }
              }}
            />
            <Typography sx={{ minWidth: 80 }}>{day}</Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                onChange={(value) =>
                  handleScheduleChange(day, "starttime", value?.format("HH:mm"))
                }
                renderInput={(props) => (
                  <TextField {...props} size="small" sx={{ flex: 1 }} />
                )}
              />
              <TimePicker
                label="End Time"
                onChange={(value) =>
                  handleScheduleChange(day, "endtime", value?.format("HH:mm"))
                }
                renderInput={(props) => (
                  <TextField {...props} size="small" sx={{ flex: 1 }} />
                )}
              />
            </LocalizationProvider>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id={`${day}-class-type-label`}>Class Type</InputLabel>
              <Select
                labelId={`${day}-class-type-label`}
                value={
                  formData.schedule.find((item) => item.day === day)?.classtype
                }
                onChange={(e) =>
                  handleScheduleChange(day, "classtype", e.target.value)
                }
              >
                <MenuItem value="Practical">Practical</MenuItem>
                <MenuItem value="Theory">Theory</MenuItem>
                <MenuItem value="Both">Both</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default BatchDetailsForm;
