import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVenues } from "../../../../Features/VenuesSlice";
import { updateFormData } from "../../../../Features/EventsSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  Grid,
  InputAdornment,
  Tooltip,
  Chip,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { TimePicker } from "@mui/x-date-pickers";
import Token from "../../../../Token/Token";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function EventForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.event);
  const [selectedDate, setSelectedDate] = useState(null);
  const currentVenues = useSelector((state) => state.venues.venues);
  const token = Token();
  const eventDates = useSelector((state) => state.event.eventDates);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      dispatch(updateFormData({ [name]: checked }));
    } else if (type === "radio" || type === "text" || type === "textarea") {
      dispatch(updateFormData({ [name]: value }));
    }
  };

  console.log(currentVenues);

  const categories = [
    "WorkShops",
    "Music Shows",
    "Meetups",
    "Kids",
    "Performances",
    "Exhibitions",
    "Others",
  ];

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    dispatch(updateFormData({ eventCategory: value }));
  };
  const handleDateSelect = (date) => {
    if (date && dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      if (!eventDates.includes(formattedDate)) {
        dispatch(
          updateFormData({ eventDates: [...eventDates, formattedDate] })
        );
      }
    } else {
      console.error("Invalid Date:", date);
    }
    setSelectedDate(null);
  };

  const handleRemoveDate = (date) => {
    const updatedDates = eventDates.filter((d) => d !== date);
    dispatch(updateFormData({ eventDates: updatedDates }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      times: formData.timeSameAllDays
        ? {
            allDays: {
              startTime: formData.startTime,
              endTime: formData.endTime,
            },
          }
        : formData.times,
    };
    console.log("Submitted Data:", formattedData);
  };

  const handleaigeneration = async () => {
    const url = "http://localhost:5000/api/auth/generateeventdescwithai";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.description;
      dispatch(updateFormData({ description: content }));
    }
  };

  const handleTimeChange = (time, name, date = null) => {
    if (
      formData.occurrence === "Recurring" &&
      !formData.timeSameAllDays &&
      date
    ) {
      const updatedTimes = {
        ...formData.times,
        [date]: { ...formData.times[date], [name]: time },
      };
      dispatch(updateFormData({ times: updatedTimes }));
    } else {
      dispatch(updateFormData({ [name]: time }));
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Grid container spacing={2}>
          {/* Event Name */}
          <Grid item xs={12}>
            <TextField
              label="Event Name"
              variant="outlined"
              fullWidth
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
            />
            <Grid container spacing={2}>
              {/* Event Category Dropdown */}
              <Grid item xs={12} my={2}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Event Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={formData.eventCategory}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Occurrence */}
          <Grid container xs={12} my={2}>
            <FormControl component="fieldset" className="flex items-center">
              <label component="legend">Occurrence</label>
              <RadioGroup
                name="occurrence"
                value={formData.occurrence}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel
                  value="Single"
                  control={<Radio />}
                  label="Single"
                />
                <FormControlLabel
                  value="Recurring"
                  control={<Radio />}
                  label="Recurring"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Multiple Dates if Recurring */}
          {formData.occurrence === "Recurring" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateSelect}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    <label htmlFor="eventDates" className="my-1">
                      Selected Dates :
                    </label>
                    {eventDates.map((date, index) => (
                      <Chip
                        key={index}
                        label={date}
                        onDelete={() => handleRemoveDate(date)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>
          )}

          <div className="flex space-x-3 items-center">
            {formData.occurrence === "Single" && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={3} alignItems="center" wrap="nowrap">
                  <Grid item xs={3}>
                    <DatePicker
                      label="Select Date"
                      value={
                        formData.eventDates[0] &&
                        dayjs(
                          formData.eventDates[0],
                          "DD-MM-YYYY",
                          true
                        ).isValid()
                          ? dayjs(formData.eventDates[0], "DD-MM-YYYY")
                          : null
                      }
                      onChange={(date) => {
                        const formattedDate = date
                          ? dayjs(date).format("DD-MM-YYYY")
                          : null;
                        if (
                          formattedDate &&
                          dayjs(formattedDate, "DD-MM-YYYY", true).isValid()
                        ) {
                          handleDateSelect(formattedDate);
                        } else {
                          console.error(
                            "Invalid date selected:",
                            formattedDate
                          ); // Log invalid date for debugging
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TimePicker
                      label="Start Time"
                      value={formData.startTime}
                      onChange={(time) => handleTimeChange(time, "startTime")}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TimePicker
                      label="End Time"
                      value={formData.endTime}
                      onChange={(time) => handleTimeChange(time, "endTime")}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}
          </div>

          {formData.occurrence === "Single" && (
            <Grid item xs={12} my={2}>
              <FormControl fullWidth>
                <InputLabel id="venue-label">Select Venue</InputLabel>
                <Select labelId="venue-label">
                  {currentVenues.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.venuename}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <div className="flex my-5">
            {/* Time Same for All Days */}
            {formData.occurrence === "Recurring" && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.timeSameAllDays}
                      onChange={handleInputChange}
                      name="timeSameAllDays"
                    />
                  }
                  label="Time same for all days?"
                />
              </Grid>
            )}
          </div>

          {/* Description
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={12}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Create with AI">
                    <InputAdornment
                      position="end"
                      sx={{
                        top: 15,
                        position: "absolute",
                        right: 0,
                        cursor: "pointer",
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ border: "none", cursor: "pointer" }}
                        onClick={() => {
                          handleaigeneration();
                        }}
                      >
                        <AutoFixHighIcon />
                      </Button>
                    </InputAdornment>
                  </Tooltip>
                ),
              }}
            />
          </Grid> */}

          {formData.occurrence === "Recurring" && (
            <>
              {formData.timeSameAllDays ? (
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Start Time (All Days)"
                      value={formData.startTime}
                      onChange={(time) => handleTimeChange(time, "startTime")}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                    <TimePicker
                      label="End Time (All Days)"
                      value={formData.endTime}
                      onChange={(time) => handleTimeChange(time, "endTime")}
                      sx={{ ml: 3 }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              ) : (
                eventDates.map((date, index) => (
                  <Grid item xs={12} key={index}>
                    <label className="mr-4"> Date : {date}</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Start Time"
                        value={formData.times?.[date]?.startTime || null}
                        onChange={(time) =>
                          handleTimeChange(time, "startTime", date)
                        }
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                      <TimePicker
                        label="End Time"
                        value={formData.times?.[date]?.endTime || null}
                        onChange={(time) =>
                          handleTimeChange(time, "endTime", date)
                        }
                        sx={{ ml: 3 }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                ))
              )}
            </>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ float: "right" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EventForm;
