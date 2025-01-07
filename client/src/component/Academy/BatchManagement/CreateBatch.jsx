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
  Grid,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import Token from "../../Token/Token";
import DialogBox from "./DialogBox";

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

const academyname = sessionStorage.getItem("academyname");
const role = sessionStorage.getItem("role");
const token = Token();

const BatchDetailsForm = () => {
  const [formData, setFormData] = useState({
    academyname: academyname,
    conflict: false,
    role: role,
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

  const [dialogbox, setdialogbox] = useState(false);
  const [msg, setmsg] = useState("");

  console.log("HEloo....", formData);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const onProceed = () => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, conflict: true };
      return updatedData;
    });
    setTimeout(() => {
      handleSubmit();
    }, 1000);
  };

  const handleScheduleChange = (day, field, value) => {
    setFormData((prevState) => {
      const existingDay = prevState.schedule.find((item) => item.day === day);

      const updatedSchedule = existingDay
        ? prevState.schedule.map((item) =>
            item.day === day
              ? {
                  ...item,
                  [field]: value,
                  ...(prevState.sameTimeForSelectedDays
                    ? { starttime: "", endtime: "", classtype: "" }
                    : {}),
                }
              : item
          )
        : [
            ...prevState.schedule,
            { day, [field]: value },
            ...(prevState.sameTimeForSelectedDays
              ? [{ starttime: "", endtime: "", classtype: "" }]
              : []),
          ];
      return { ...prevState, schedule: updatedSchedule };
    });
  };

  const convertData = (data) => {
    const {
      academyname,
      conflict,
      batchname,
      maximumstudents,
      course,
      specificDetails,
      classtype,
      sameTimeForSelectedDays,
      selectedDays,
      globalStartTime,
      globalEndTime,
      globalClassType,
      schedule,
      role,
    } = data;

    const convertedSchedule = schedule.map((item) => {
      if (sameTimeForSelectedDays) {
        return {
          day: item.day,
          starttime: globalStartTime
            ? formatTime(globalStartTime)
            : item.starttime,
          endtime: globalEndTime ? formatTime(globalEndTime) : item.endtime,
          classtype: item.classtype || globalClassType,
        };
      } else {
        return {
          day: item.day,
          starttime: item.starttime,
          endtime: item.endtime,
          classtype: item.classtype,
        };
      }
    });

    const filteredSchedule = selectedDays.length
      ? convertedSchedule.filter((item) => selectedDays.includes(item.day))
      : convertedSchedule;

    const convertedSpecificDetails = {
      instruments: specificDetails || [],
    };

    const result = {
      academyname: academyname || "",
      role: role || "",
      batchname: batchname || "",
      maximumstudents: maximumstudents || "",
      course: course || "",
      specificDetails: convertedSpecificDetails,
      classtype: classtype || globalClassType,
      sameTimeForSelectedDays,
      schedule: filteredSchedule,
      conflict: conflict,
    };

    return result;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const handleSubmit = async () => {
    const submissionData = formData.sameTimeForSelectedDays
      ? {
          ...formData,
          schedule: daysOfWeek.map((day) =>
            formData.selectedDays.includes(day)
              ? {
                  day,
                  starttime: formData.globalStartTime,
                  endtime: formData.globalEndTime,
                  classtype:
                    formData.schedule.find((item) => item.day === day)
                      ?.classtype || formData.globalClassType,
                }
              : formData.schedule.find((item) => item.day === day) || {
                  day,
                  starttime: "",
                  endtime: "",
                  classtype: "",
                }
          ),
        }
      : {
          ...formData,
        };

    const formattedData = convertData(submissionData);

    console.log("Submitted Data: ", formattedData);

    if (
      !formData.academyname ||
      !formData.batchname ||
      !formData.maximumstudents ||
      !formData.course ||
      formData.specificDetails?.instruments?.length === 0
    ) {
      return toast.error("Please fill all required fields.");
    }

    const url = "http://localhost:5000/api/auth/addbatchesnew";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          academyname: formattedData.academyname,
          batchname: formattedData.batchname,
          maximumstudents: formattedData.maximumstudents,
          course: formattedData.course,
          specificDetails: formattedData.specificDetails,
          classtype: formattedData.classtype,
          schedule: formattedData.schedule,
          role: formattedData.role,
          conflict: formattedData.conflict,
        }),
      });

      if (response.ok) {
        setdialogbox(false);
        toast.success("Batch created successfully.");
        setFormData({
          academyname: academyname,
          role: role,
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
      } else {
        const data = await response.json();
        if (response.status === 400) {
          setmsg(data.message);
          setdialogbox(true);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
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
        onChange={(e) => handleChange("batchname", e.target.value.trim())}
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
        className="mb-3"
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
                onChange={(value) => {
                  handleChange(
                    "globalStartTime",
                    value?.clone().format("HH:mm")
                  );
                }}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
              <TimePicker
                label="End Time"
                onChange={(value) => {
                  handleChange("globalEndTime", value?.clone().format("HH:mm"));
                }}
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

      {formData.sameTimeForSelectedDays &&
        formData.globalClassType === "Both" && (
          <>
            <div className="mt-4">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Assign Class Type for Each Selected Day
              </Typography>
              <Grid container spacing={2}>
                {formData.selectedDays.map((day) => (
                  <Grid item xs={12} sm={6} key={day}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ minWidth: 100 }}>{day}</Typography>
                      <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel id={`${day}-specific-class-type-label`}>
                          Class Type
                        </InputLabel>
                        <Select
                          labelId={`${day}-specific-class-type-label`}
                          value={
                            formData.schedule.find((item) => item.day === day)
                              ?.classtype || ""
                          }
                          onChange={(e) =>
                            handleScheduleChange(
                              day,
                              "classtype",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="Practical">Practical</MenuItem>
                          <MenuItem value="Theory">Theory</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </div>
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
                value={
                  formData.schedule.find((item) => item.day === day)?.starttime
                    ? dayjs(
                        formData.schedule.find((item) => item.day === day)
                          ?.starttime,
                        "HH:mm"
                      )
                    : null
                }
                onChange={(value) =>
                  handleScheduleChange(day, "starttime", value?.format("HH:mm"))
                }
                renderInput={(props) => (
                  <TextField {...props} size="small" sx={{ flex: 1 }} />
                )}
              />
              <TimePicker
                label="End Time"
                value={
                  formData.schedule.find((item) => item.day === day)?.endtime
                    ? dayjs(
                        formData.schedule.find((item) => item.day === day)
                          ?.endtime,
                        "HH:mm"
                      )
                    : null
                }
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
                  formData.schedule.find((item) => item.day === day)
                    ?.classtype || ""
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

      <div className="py-5">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ width: "100px", marginBottom: 2, float: "right" }}
        >
          Submit
        </Button>
      </div>

      <DialogBox
        open={dialogbox}
        onClose={() => {
          setdialogbox(false);
        }}
        onProceed={() => {
          onProceed();
        }}
        message={msg}
      />
    </Box>
  );
};

export default BatchDetailsForm;
