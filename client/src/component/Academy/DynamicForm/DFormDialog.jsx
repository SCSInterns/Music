"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  Button,
  Input,
  Typography,
  Box,
  Grid,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";

export default function FieldDialog({ open, onClose, onSave, fieldType }) {
  const [label, setTypography] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [options, setOptions] = useState([""]);
  const [courseDetails, setCourseDetails] = useState([
    { course: "", fees: "" },
  ]);

  const handleSave = () => {
    const field = {
      id: Math.random().toString(36).substr(2, 9),
      type: fieldType,
      label,
      placeholder,
      ...(fieldType === "radio" || fieldType === "dropdown" ? { options } : {}),
      ...(fieldType === "dropdown-course" ? { courseDetails } : {}),
    };
    onSave(field);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Button
          onClick={onClose}
          color="error"
          sx={{ float: "right", paddingBottom: "5px" }}
          variant="outlined"
        >
          <CloseIcon fontSize="medium" />
        </Button>
        <DialogTitle align="center">Configure {fieldType} field</DialogTitle>
        <Box className="py-4">
          {/* Field Label and Placeholder */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Field Label
              </Typography>
              <Input
                fullWidth
                id="label"
                value={label}
                onChange={(e) => setTypography(e.target.value)}
                placeholder="Enter field label"
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  border: "1px solid #ccc",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Placeholder Text
              </Typography>
              {fieldType === "textarea" ? (
                <TextareaAutosize
                  minRows={3}
                  maxRows={6}
                  id="placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                />
              ) : (
                <Input
                  fullWidth
                  id="placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    border: "1px solid #ccc",
                  }}
                />
              )}
            </Grid>
          </Grid>

          {/* Options for radio and dropdown */}
          {(fieldType === "radio" || fieldType === "dropdown") && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Options
              </Typography>
              {options.map((option, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={9}>
                    <Input
                      fullWidth
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      sx={{
                        padding: 1,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                  </Grid>
                  <Grid item xs={3} marginY={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setOptions(options.filter((_, i) => i !== index))
                      }
                      sx={{
                        width: "20%",
                        padding: 0,
                        border: "none",
                        marginTop: "5px",
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={() => setOptions([...options, ""])}
                sx={{ marginTop: 2 }}
              >
                Add Option
              </Button>
            </Box>
          )}

          {/* Course details for dropdown-course */}
          {fieldType === "dropdown-course" && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Course Details
              </Typography>
              {courseDetails.map((detail, index) => (
                <Grid container key={index} spacing={2}>
                  <Grid item xs={5} marginY={1}>
                    <Input
                      fullWidth
                      value={detail.course}
                      onChange={(e) => {
                        const newDetails = [...courseDetails];
                        newDetails[index] = {
                          ...detail,
                          course: e.target.value,
                        };
                        setCourseDetails(newDetails);
                      }}
                      placeholder="Course name"
                      sx={{
                        padding: 1,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                  </Grid>
                  <Grid item xs={5} marginY={1}>
                    <Input
                      fullWidth
                      value={detail.fees}
                      onChange={(e) => {
                        const newDetails = [...courseDetails];
                        newDetails[index] = { ...detail, fees: e.target.value };
                        setCourseDetails(newDetails);
                      }}
                      placeholder="Fees"
                      sx={{
                        padding: 1,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setCourseDetails(
                          courseDetails.filter((_, i) => i !== index)
                        )
                      }
                      sx={{
                        width: "20%",
                        padding: 0,
                        border: "none",
                        marginTop: "20px",
                      }}
                    >
                      <RemoveIcon />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setCourseDetails([...courseDetails, { course: "", fees: "" }])
                }
                sx={{ marginTop: 2 }}
              >
                Add Course
              </Button>
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              width: "30%",
              bgcolor: "black",
              ":hover": { backgroundColor: "black" },
            }}
          >
            Save Field
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
