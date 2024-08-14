import * as React from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Token from "../Token/Token";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

function AcademyDashboard() {
  const academyname = sessionStorage.getItem("academyname");

  const [toggleapplicants, settoggleapplicants] = useState(false);
  const [appdata, setappdata] = useState([]);
  const navigate = useNavigate();
  const datatypes = [
    { value: "String", label: "String" },
    { value: "Number", label: "Number" },
    { value: "Object", label: "Dropdown List" },
    { value: "Object", label: "Radio Button" },
    { value: "Email", label: "Email Id" },
  ];

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState([]);
  const [dropdown, setdropdown] = useState(false);
  const [option, setoption] = useState("");
  const [labeloption, setlabeloption] = useState([]) ; 
  const [valueoption, setvalueoption] = useState([])
  const [dynamicOptions, setDynamicOptions] = useState([]);

  const role = sessionStorage.getItem("role");
  console.log(dynamicOptions);
  console.log(labeloption)
  console.log(valueoption)
  const handleAddition = async () => {
    if (value === "Dropdown List") {
      setdropdown(true);
    }

    if (label && value) {
      console.log(label);
      console.log(value);
      setEntries([...entries, { LabelName: label, ValueType: value }]);
      setLabel("");
      setValue("");
    } else {
      toast.error("Both label and value type are required.");
    }
  };

  const handledynamicoption = async () => {
    const numberOfOptions = parseInt(option, 10);

    if (isNaN(numberOfOptions) || numberOfOptions <= 0) {
      toast.error("Please enter a valid number of options.");
      return;
    }

    const newOptions = Array(numberOfOptions).fill({label: "", value: ""});
    setDynamicOptions(newOptions);
  };

  const handleoptionsubmition = async () => {  
    
   setDynamicOptions({
    label : labeloption , 
    value : valueoption
    
   })

   console.log(dynamicOptions)
  };

  const handleapplicants = async () => {
    settoggleapplicants(true);

    let url = "http://localhost:5000/api/auth/getdata";
    const token = Token();
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

    const data = await response.json();

    if (Array.isArray(data)) {
      setappdata(data);
      toast.success("Details Fetch Success");
    } else {
      toast.error("Error fetching details");
    }
  };

  const getDynamicHeaders = () => {
    if (appdata.length > 0) {
      const firstApplicant = appdata[0];
      return Object.keys(firstApplicant).filter(
        (key) =>
          key !== "_id" &&
          key !== "__v" &&
          key !== "academy_name" &&
          key !== "role"
      );
    }
    return [];
  };

  const handleSubmit = async () => {
    const additionalFields = entries.reduce((acc, entry) => {
      acc[entry.LabelName] = entry.ValueType;
      return acc;
    }, {});

    // Assuming dynamicOptions includes the courses data
    const courses = dynamicOptions.reduce((acc, option) => {
      const [courseName, courseFee] = option.split(":"); // Assuming format is "courseName:courseFee"
      if (courseName && courseFee) {
        acc[courseName] = courseFee;
      }
      return acc;
    }, {});

    let url = `http://localhost:5000/api/auth/academyregform`;
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        additionalFields: additionalFields,
        courses: courses,
      }),
    });

    if (response.ok) {
      toast.success("Form Created Successfully");
      navigate(`/${academyname}/admin/regform`);
    } else {
      toast.error("Form Creation Failed");
    }
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#283255",
          fontWeight: "bold",
          color: "white",
          padding: "25px",
          borderBottom: "2px solid black",
        }}
      >
        <h1 style={{ fontSize: "20px" }}>Welcome {academyname} Academy</h1>
        <p style={{ fontSize: "15px", marginTop: "10px" }}>Admin Dashboard</p>
      </div>

      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            height: "100%",
            width: "20%",
            borderRight: "2px solid black",
            backgroundColor: "#283255",
            color: "white",
          }}
        >
          <Button
            style={{ margin: "10px", width: "200px" }}
            variant="contained"
            onClick={() => navigate(`/${academyname}/admin/regform`)}
          >
            Registration form
          </Button>

          <Divider />
          <Button
            variant="contained"
            style={{ margin: "10px", width: "200px" }}
            onClick={handleapplicants}
          >
            Applicants Data
          </Button>
          <Divider />
        </div>
        <div
          style={{
            height: "100%",
            width: "80%",
            backgroundColor: "#f3f3f5",
          }}
        >
          {toggleapplicants === false ? (
            <>
              <p style={{ padding: "10px", fontFamily: "sans-serif" }}>
                Create Academy Registration Form Here
              </p>

              <Divider />
              <div>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Typography>Enter Label Name Here:</Typography>
                  <TextField
                    id="outlined-basic"
                    label="Label"
                    variant="outlined"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </Box>
                <Divider sx={{ marginTop: "20px" }} />

                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Typography>Enter Label Type Here:</Typography>
                  <TextField
                    id="outlined-select-currency-native"
                    select
                    value={value}
                    SelectProps={{ native: true }}
                    style={{ width: "50%" }}
                    helperText="Please select your data type for defined label here"
                    onChange={(e) => setValue(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {datatypes.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Box>
                <Divider sx={{ marginTop: "10px" }} />

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#283255",
                    margin: "30px",
                    float: "right",
                  }}
                  onClick={handleAddition}
                >
                  Add
                </Button>
              </div>

              {dropdown ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 1, width: "25ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="outlined-basic"
                        label="Enter no of options"
                        variant="outlined"
                        onChange={(e) => setoption(e.target.value)}
                      />

                      <Button variant="contained" onClick={handledynamicoption}>
                        {" "}
                        Generate Option{" "}
                      </Button>
                    </Box>
                  </div>

                  {/* Render dynamic TextFields */}
                  <div
                    style={{
                      padding: "10px",
                      margin: "10px",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {dynamicOptions.map((_, index) => (
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                        key={index}
                      >
                        <TextField
                          id={`option-${index}`}
                          label={`Option ${index + 1}`}
                          variant="outlined"
                          onChange={(e) => {
                            const newOptions = [...dynamicOptions];
                            newOptions[index] = e.target.value;
                            setlabeloption(newOptions);
                          }}
                        />
                        <TextField
                          id={`optionvalue-${index}`}
                          label={`Fees ${index + 1}`}
                          variant="outlined"
                          onChange={(e) => {
                            const newOptions = [...dynamicOptions];
                            newOptions[index] = e.target.value;
                            setvalueoption(newOptions);
                          }}
                        />
                      </Box>
                    ))}

                    <Button
                      variant="contained"
                      onClick={handleoptionsubmition}
                      sx={{ width: "100px", height: "50px" }}
                    >
                      Submit
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* Table */}
              <div style={{ padding: "10px" }}>
                <Typography variant="h6" gutterBottom>
                  Added Data
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Label Name</TableCell>
                        <TableCell>Value Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entries.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.LabelName}</TableCell>
                          <TableCell>{entry.ValueType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#283255",
                  margin: "30px",
                  float: "right",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <div style={{ padding: "10px" }}>
                <Typography variant="h6" gutterBottom>
                  {academyname} Applicants Data
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {getDynamicHeaders().map((header, index) => (
                          <TableCell key={index}>{header}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appdata.map((applicant, index) => (
                        <TableRow key={index}>
                          {getDynamicHeaders().map((header, i) => (
                            <TableCell key={i}>
                              {typeof applicant[header] === "object"
                                ? JSON.stringify(applicant[header])
                                : applicant[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AcademyDashboard;
