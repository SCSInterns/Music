import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../../../../Features/EventsSlice";
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
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Token from "../../../../Token/Token";

function EventForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.event);
  const token = Token();

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      dispatch(updateFormData({ [name]: checked }));
    } else if (type === "radio" || type === "text" || type === "textarea") {
      dispatch(updateFormData({ [name]: value }));
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    dispatch(
      updateFormData({
        eventDates: value.split(",").map((date) => date.trim()),
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
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
          </Grid>

          {/* Occurrence */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Occurrence</FormLabel>
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
            <Grid item xs={12}>
              <TextField
                label="Multiple Dates (comma-separated)"
                variant="outlined"
                fullWidth
                name="eventDates"
                value={formData.eventDates.join(", ")}
                onChange={handleDateChange}
                helperText="Enter dates separated by commas (e.g., 2025-01-01, 2025-01-02)"
              />
            </Grid>
          )}

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

          {/* Venue Same for All Locations */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.venueSameForAll}
                  onChange={handleInputChange}
                  name="venueSameForAll"
                />
              }
              label="Venue same for all locations?"
            />
          </Grid>

          {/* Description */}
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
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EventForm;
