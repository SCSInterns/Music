import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { motion } from "framer-motion";
import {
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

function AcademyRegistration({ academyName, Role }) {
  const [formFields, setFormFields] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [radio, setRadio] = useState([]);
  const [formdata, setFormdata] = useState({});
  const [courseFee, setCourseFee] = useState("");
  var academyname = sessionStorage.getItem("academyname");
  var role = sessionStorage.getItem("role");

  function validateForm(formdata, formFields) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\d{10}$/;
    const minLengthPattern = /^.{5,}$/;
    const notBlankPattern = /^(?!\s*$).+/;

    let validationResults = {
      isValid: true,
      errors: {},
    };

    console.log(formFields);
    Object.keys(formFields).forEach((field) => {
      if (
        field === "Courses-Type" ||
        field === "Radio-Type" ||
        field === "Radio-Type_Options" ||
        field === "Courses-Type_Options"
      ) {
        return;
      }
      switch (field) {
        case "Email":
          if (!emailPattern.test(formdata[field] || "")) {
            validationResults.errors.email = "Invalid email format";
            validationResults.isValid = false;
          }
          break;
        case "MobileNo":
          if (!mobilePattern.test(formdata[field] || "")) {
            validationResults.errors.mobile = "Mobile number must be 10 digits";
            validationResults.isValid = false;
          }
          break;
        case "Name":
          if (!notBlankPattern.test(formdata[field] || "")) {
            validationResults.errors.name = "Name cannot be blank ";
            validationResults.isValid = false;
          }
          break;
        case "Address":
          if (!minLengthPattern.test(formdata[field] || "")) {
            validationResults.errors.address =
              "Address must be at least 5 characters long";
            validationResults.isValid = false;
          }
          break;
        case "Gender":
          if (!notBlankPattern.test(formdata[field] || "")) {
            validationResults.errors.gender = "Gender cannot be blank";
            validationResults.isValid = false;
          }
          break;
        case "Courses":
          if (!notBlankPattern.test(formdata[field] || "")) {
            validationResults.errors.courses = "Courses cannot be blank";
            validationResults.isValid = false;
          }
          break;
        default:
          if (!notBlankPattern.test(formdata[field] || "")) {
            validationResults.errors[field] = `${field} cannot be blank`;
            validationResults.isValid = false;
          }
          break;
      }
    });

    return validationResults;
  }

  const fetchForm = async (academy) => {
    if (academy) {
      academyname = academy;
    }
    let url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/getform";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const additionalFields = data[0].additionalFields || {};
          setFormFields(additionalFields);
          setDropdownOptions(additionalFields["Courses-Type_Options"] || []);
          setRadio(additionalFields["Radio-Type_Options"] || []);
        } else {
          toast.error("No form data available");
        }
      } else {
        toast.error("Error Fetching Form");
      }
    } catch (error) {
      toast.error("Error Fetching Form");
    }
  };

  console.log(academyName);

  useEffect(() => {
    if (academyName) {
      console.log(academyName);
      fetchForm(academyName);
    } else if (academyname) {
      fetchForm(academyname);
    }
  }, [academyName, academyname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });

    if (name === "Courses") {
      const selectedOption = dropdownOptions.find(
        (option) => option.label === value
      );
      if (selectedOption) {
        setCourseFee(selectedOption.value);
      }
    }
  };

  console.log(formdata);
  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (Role) {
      role = Role;
    }

    if (academyName) {
      academyname = academyName;
    }

    const validationResult = validateForm(formdata, formFields);

    if (!validationResult.isValid) {
      Object.values(validationResult.errors).forEach((errorMessage) => {
        toast.error(errorMessage);
      });
      return;
    }

    let url = `https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/savedata`;

    console.log(academyname, role);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        userdetails: { formdata, fees: courseFee },
      }),
    });

    if (response.ok) {
      toast.success("Form Submitted Successfully");
      setFormdata({});
      setCourseFee("");
    } else {
      toast.error("Error Submitting Form");
    }
  };

  const renderInputFields = () => {
    return Object.entries(formFields).map(([label, type]) => {
      if (label === "Courses" && type === "Dropdown List") {
        return (
          <div key={label} className="mb-2">
            <div className="flex w-full   justify-between items-center">
              <label htmlFor={label} className="block text-gray-700 font-bold">
                {label}:
              </label>

              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "100%" },
                }}
                noValidate
                autoComplete="off"
              >
                <FormControl>
                  <Select
                    value={formdata[label] || ""}
                    name={label}
                    onChange={handleChange}
                    displayEmpty
                    required
                    sx={{ width: "400px" }}
                  >
                    <MenuItem disabled value="">
                      Please select your option
                    </MenuItem>
                    {Array.isArray(dropdownOptions) &&
                      dropdownOptions.map((option) => (
                        <MenuItem key={option.value} value={option.label}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {courseFee && (
                  <TextField
                    label="Course Fee"
                    variant="outlined"
                    value={courseFee || "Please select course "}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ marginLeft: "100px", width: "70%" }}
                  />
                )}
              </Box>
            </div>
          </div>
        );
      } else if (label === "Gender" && type === "Radio Button") {
        return (
          <div key={label} className="mb-2">
            <div className="flex justify-between items-center">
              <label htmlFor={label} className="block text-gray-700 font-bold">
                {label}:
              </label>

              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "100%", display: "flex" },
                }}
                noValidate
                autoComplete="off"
              >
                <FormControl component="fieldset" fullWidth sx={{}}>
                  <RadioGroup
                    value={formdata[label] || ""}
                    name={label}
                    onChange={handleChange}
                    aria-label={label}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "100px",
                    }}
                  >
                    {radio.length === 0 ? (
                      <FormControlLabel
                        value=""
                        control={<Radio />}
                        label="Please select your option"
                        disabled
                      />
                    ) : (
                      radio.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))
                    )}
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          </div>
        );
      } else {
        return (
          <>
            {(label === "Courses-Type" && type === "Values") ||
            (label === "Radio-Type" && type === "Radio") ||
            label === "Radio-Type_Options" ||
            label === "Courses-Type_Options" ? null : (
              <div key={label} className="mb-2">
                <div className="flex justify-between  items-center">
                  <label
                    htmlFor={label}
                    className="block text-gray-700 font-bold"
                  >
                    {label}:
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div className="w-full">
                      <TextField
                        label={label}
                        variant="outlined"
                        sx={{ marginRight: "20px", width: "400px" }}
                        type={
                          type.toLowerCase() === "email id" ? "email" : "text"
                        }
                        onChange={handleChange}
                        id={label}
                        fullWidth
                        name={label}
                        value={formdata[label] || ""}
                        required
                      />
                    </div>
                  </Box>
                </div>
              </div>
            )}
          </>
        );
      }
    });
  };

  return (
    <motion.div
      initial={{ x: 20, y: 20, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeIn", staggerChildren: 0.1 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "75%",
          maxWidth: "600px",
        }}
      >
        <h1 className="text-2xl font-bold mb-2 text-center">
          {academyname} Registration Form
        </h1>

        <Divider />
        <form style={{ marginTop: "20px" }} onSubmit={handleFormSubmission}>
          {renderInputFields()}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default AcademyRegistration;
