import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

const DynamicForm = ({ formData }) => {
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  var academyname = sessionStorage.getItem("academyname");

  const handleChange = (label, value) => {
    setFormValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    formData.additionalFields.forEach((field) => {
      const value = formValues[field.label];

      if (field.required && !value) {
        errors[field.label] = `${field.label} is required`;
      }

      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors[field.label] = "Invalid email format";
      }

      if (field.type === "mobile-no" && value && !/^\d{10}$/.test(value)) {
        errors[field.label] = "Invalid mobile number (10 digits required)";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    console.log(formValues);

    let url = `https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/savedata`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: "User",
        userdetails: { formValues },
      }),
    });

    if (response.ok) {
      toast.success("Form Submitted Successfully");
      setFormValues({});
      setFormErrors({});
    } else {
      toast.error("Error Submitting Form");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: "500px",
          margin: "auto",
          padding: 3,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {formData.academy_name} - {formData.formname}
        </Typography>
        {formData.additionalFields.map((field) => {
          switch (field.type) {
            case "text":
            case "number":
              return (
                <TextField
                  key={field._id}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  fullWidth
                  required={field.required}
                  error={!!formErrors[field.label]}
                  helperText={formErrors[field.label]}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              );

            case "email":
              return (
                <TextField
                  key={field._id}
                  label={field.label}
                  placeholder={field.placeholder}
                  type="email"
                  fullWidth
                  required={field.required}
                  error={!!formErrors[field.label]}
                  helperText={formErrors[field.label]}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              );

            case "mobile-no":
              return (
                <TextField
                  key={field._id}
                  label={field.label || "Mobile Number"}
                  placeholder={field.placeholder || "Enter mobile number"}
                  type="number"
                  fullWidth
                  required={field.required}
                  error={!!formErrors[field.label]}
                  helperText={formErrors[field.label]}
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              );

            case "textarea":
              return (
                <TextField
                  key={field._id}
                  label={field.label}
                  placeholder={field.placeholder}
                  multiline
                  rows={3}
                  fullWidth
                  required={field.required}
                  error={!!formErrors[field.label]}
                  helperText={formErrors[field.label]}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                />
              );

            case "dropdown-course":
              return (
                <TextField
                  key={field._id}
                  label={field.label}
                  select
                  fullWidth
                  required
                  onChange={(e) => {
                    const selectedOption = field.courseDetails.find(
                      (course) => course.course === e.target.value
                    );
                    handleChange("Courses", selectedOption.course);
                    handleChange("Fees", selectedOption.fees);
                  }}
                >
                  {field.courseDetails.map((course) => (
                    <MenuItem key={course._id} value={course.course}>
                      {`${course.course} - ₹${course.fees}`}
                    </MenuItem>
                  ))}
                </TextField>
              );

            case "radio":
              return (
                <Box key={field._id}>
                  <Typography align="left">{field.label} :</Typography>
                  <RadioGroup
                    row
                    onChange={(e) => handleChange(field.label, e.target.value)}
                  >
                    {field.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              );

            default:
              return null;
          }
        })}
        <div className="flex flex-row-reverse">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              width: "150px",
              bgcolor: "black",
              ":hover": { bgcolor: "black" },
            }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </>
  );
};

export default function App() {
  const [formFields, setFormFields] = useState([]);
  const [regname, setregname] = useState("");
  const academyname =
    sessionStorage.getItem("academyname") || sessionStorage.getItem("Academy");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(
          "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/getform",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ academyname }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setregname(data[0].form_name);
            setFormFields(data[0].additionalFields || []);
          } else {
            toast.error("No form data available");
          }
        } else {
          toast.error("Error fetching form");
        }
      } catch (error) {
        toast.error("Error fetching form");
      }
    };

    if (academyname) fetchForm();
  }, [academyname]);

  return (
    <DynamicForm
      formData={{
        academy_name: academyname,
        additionalFields: formFields,
        formname: regname,
      }}
    />
  );
}
