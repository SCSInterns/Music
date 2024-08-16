import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

function AcademyRegistration() {
  const [formFields, setFormFields] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [formdata, setformdata] = useState({});
  const [courseFee, setCourseFee] = useState(""); // State to store the selected course fee
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const fetchform = async () => {
    let url = "http://localhost:5000/api/auth/getform";

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
          toast.success("Form Fetch Success");
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

  useEffect(() => {
    fetchform();
  }, [academyname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setformdata({
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

  const handleformsubmition = async (e) => {
    e.preventDefault();
    let url = `http://localhost:5000/api/auth/savedata`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        userdetails: formdata,
      }),
    });

    if (response.ok) {
      toast.success("Form Submitted Successfully");
      setformdata({});
      setCourseFee(""); 
    } else {
      toast.error("Error Submitting Form");
    }
  };

  const renderInputFields = () => {
    return Object.entries(formFields).map(([label, type]) => {
      if (label === "Courses" && type === "Dropdown List") {
        return (
          <div key={label} className="mb-4">
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
              <FormControl fullWidth>
                <Select
                  value={formdata[label] || ""}
                  name={label}
                  onChange={handleChange}
                  displayEmpty
                  required
                  renderValue={
                    formdata[label] !== ""
                      ? undefined
                      : () => "Please select your option"
                  }
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
          
             {courseFee  
             ?  
             <>
                 <TextField
                label="Course Fee"
                variant="outlined"
                value={courseFee || "Please select course "}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 2 }}
              />
             </>: 
             <>
             </>
      }          
            </Box>
          </div>
        );
      } else {
        return (
          <>
            {(label === "Courses-Type" && type === "Values") ||
            label === "Courses-Type_Options" ? (
              <></>
            ) : (
              <div key={label} className="mb-4">
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
                  <TextField
                    label={label}
                    variant="outlined"
                    type={
                      typeof type === "string" &&
                      type.toLowerCase() === "email id"
                        ? "email"
                        : "text"
                    }
                    onChange={handleChange}
                    id={label}
                    name={label}
                    value={formdata[label] || ""}
                    required
                  />
                </Box>
              </div>
            )}
          </>
        );
      }
    });
  };

  return (
    <div
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
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {academyname} Registration Form
        </h1>

        <Divider />
        <form style={{ marginTop: "20px" }} onSubmit={handleformsubmition}>
          {renderInputFields()}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default AcademyRegistration;
