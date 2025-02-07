import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVenues } from "../../../../Features/VenuesSlice";
import { nextStep } from "../../../../Features/StepperSlice";
import { updateFormData } from "../../../../Features/EventsSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BannerImagePicker from "../CreateLayout/BannerUploader";
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
import { toast } from "react-toastify";
import "dayjs/locale/en-in";

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
    } else if (name === "form-venue") {
      dispatch(updateFormData({ ["venueid"]: value }));
    } else if (name === "venuetype") {
      dispatch(updateFormData({ [name]: value }));
    }
  };

  console.log(currentVenues);
  console.log(formData);

  const categories = [
    "WorkShops",
    "Music Shows",
    "Meetups",
    "Kids",
    "Performances",
    "Exhibitions",
    "Others",
  ];

  const Venues = ["Ground", "Party Plot", "Stadium", "Theatre", "Auditorium"];

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

  const handleSubmit = async (e) => {
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
      role: sessionStorage.getItem("role"),
    };
    console.log("Submitted Data:", formattedData);
    const url = "http://localhost:5000/api/auth/createeventdetails";

    const CreateEvent = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (CreateEvent.ok) {
      toast.success("Application Proceeded");
      dispatch(nextStep());
    } else {
      toast.error("Error saving Application");
    }
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

  const imageselect = async (file) => {
    console.log(file);
    const url = "http://localhost:5000/api/auth/uploadeventbannerimage";
    const formdata = new FormData();
    formdata.append("picture", file);
    formdata.append("eventid", "67a3561e4fce44a72a65bbc0");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formdata,
    });
    if (response.ok) {
      toast.success("Banner Image Uploaded Successfully");
    } else {
      toast.error("Banner Image Upload Failed");
    }
  };

  return (
    <>
      <div className="form-container !my-4">
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

              <Grid container spacing={2}>
                {/* Event Venue Type  Dropdown */}
                <Grid item xs={12} my={2}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">
                      Event Venue Type
                    </InputLabel>
                    <Select
                      labelId="category-label"
                      value={formData.venuetype}
                      onChange={handleInputChange}
                      name="venuetype"
                    >
                      {Venues.map((category) => (
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
            <Grid container xs={12} my={2} ml={2}>
              <FormControl component="fieldset" className="flex items-center">
                <label>Occurrence :</label>
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
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={handleDateSelect}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          sx={{ maxWidth: 200 }}
                        />
                      )}
                      disablePast
                      PopperProps={{
                        modifiers: [
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "window",
                            },
                          },
                          {
                            name: "flip",
                            options: {
                              fallbackPlacements: ["top"],
                            },
                          },
                        ],
                      }}
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

            <div className="flex space-x-3 items-center ml-4">
              {formData.occurrence === "Single" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={3} alignItems="center" wrap="nowrap">
                    <Grid item xs={3}>
                      <TextField
                        label="Select Date"
                        type="date"
                        value={formData.eventDates[0] || ""}
                        onChange={(e) => {
                          const formattedDate = e.target.value;
                          dispatch(
                            updateFormData({ eventDates: [formattedDate] })
                          );
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
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
                  <Select
                    labelId="venue-label"
                    name="form-venue"
                    onChange={handleInputChange}
                  >
                    {currentVenues.map((venue) => (
                      <MenuItem key={venue._id} value={venue._id}>
                        {venue.venuename}, {venue.city} , {venue.state} -{" "}
                        {venue.pincode}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.venueSameForAll}
                        onChange={handleInputChange}
                        name="venueSameForAll"
                      />
                    }
                    label="Venue same for all days?"
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

            {formData.occurrence === "Recurring" &&
              formData.venueSameForAll === true && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="venue-label">Select Venue</InputLabel>
                    <Select
                      labelId="venue-label"
                      name="form-venue"
                      onChange={handleInputChange}
                    >
                      {currentVenues.map((venue) => (
                        <MenuItem key={venue._id} value={venue._id}>
                          {venue.venuename}, {venue.city} , {venue.state} -{" "}
                          {venue.pincode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

            {formData.occurrence === "Recurring" &&
              formData.venueSameForAll === false && (
                <Grid item xs={12} my={2}>
                  {eventDates.map((date, index) => (
                    <Grid item xs={12} key={index} my={2}>
                      <label className="mr-4"> Date : {date}</label>
                      <FormControl fullWidth>
                        <InputLabel id="venue-label">Select Venue</InputLabel>
                        <Select
                          labelId="venue-label"
                          name="form-venue"
                          onChange={handleInputChange}
                        >
                          {currentVenues.map((venue) => (
                            <MenuItem key={venue._id} value={venue._id}>
                              {venue.venuename}, {venue.city} , {venue.state} -{" "}
                              {venue.pincode}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              )}

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
          </Grid>
        </form>

        <div className="my-4">
          <h3 className="text-md text-left my-4 font-semibold">
            Upload Event Banner :
          </h3>
          <BannerImagePicker onImageSelect={imageselect} />
        </div>

        {/* Submit Button */}
        <div className="pb-3">
          <Grid item xs={12} my={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ float: "right", my: 8 }}
            >
              Next
            </Button>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default EventForm;
