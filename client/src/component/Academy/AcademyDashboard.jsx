import * as React from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
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
  const role = sessionStorage.getItem("role");
  const [toggleapplicants, settoggleapplicants] = useState(false);
  const [appdata, setappdata] = useState([]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [option, setOption] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [radio, setradio] = useState(false);
  const [radiovalue, setradiovalue] = useState([]);

  const datatypes = [
    { value: "String", label: "String" },
    { value: "Number", label: "Number" },
    { value: "Object", label: "Dropdown List" },
    { value: "Object", label: "Radio Button" },
    { value: "Email", label: "Email Id" },
  ];

  const verifyurl = async () => {
    const url = `http://localhost:5000/api/auth/verifyurl`;
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
      }),
    });

    if (!response.ok) {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    verifyurl();
  }, [academyname]);

  const navigate = useNavigate();

  const handleAddition = () => {
    if (label && value) {
      if (value === "Dropdown List") {
        setDropdown(true);
      }
      if (value === "Radio Button") {
        setradio(true);
      }
      setEntries([...entries, { LabelName: label, ValueType: value }]);
      setLabel("");
      setValue("");
    } else {
      toast.error("Both label and value type are required.");
    }
  };

  const handleOptionChange = (index, type, value) => {
    const newOptions = [...dynamicOptions];
    newOptions[index] = { ...newOptions[index], [type]: value };
    setDynamicOptions(newOptions);
  };

  const handleDynamicOption = () => {
    const numberOfOptions = parseInt(option, 10);

    if (isNaN(numberOfOptions) || numberOfOptions <= 0) {
      toast.error("Please enter a valid number of options.");
      return;
    }

    setDynamicOptions(Array(numberOfOptions).fill({ label: "", value: "" }));
  };

  const handleOptionSubmission = () => {
    const formattedOptions = dynamicOptions.reduce((acc, { label, value }) => {
      if (label && value) {
        acc.push({ label, value });
      }
      return acc;
    }, []);
    setEntries([
      ...entries,
      {
        LabelName: "Courses-Type",
        ValueType: "Values",
        Options: formattedOptions,
      },
    ]);
    setDropdown(false);
    setOption("");
    setDynamicOptions([]);
  };

  const handleradiochange = (index, value) => {
    const newRadioOptions = [...radiovalue];
    newRadioOptions[index] = value;
    setradiovalue(newRadioOptions);
  };

  useEffect(() => {
    console.log("Updated entries:", entries);
  }, [entries]);

  const handleradiobutton = () => {
    const formattedRadioOptions = radiovalue.filter((value) => value);

    console.log(formattedRadioOptions);
    setEntries([
      ...entries,
      {
        LabelName: "Radio-Type",
        ValueType: "Radio",
        Options: formattedRadioOptions,
      },
    ]);
    setradio(false);
    setOption("");
    setradiovalue([]);
  };

  const handleApplicants = async () => {
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
      if (entry.Options) {
        acc[`${entry.LabelName}_Options`] = entry.Options;
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
            onClick={handleApplicants}
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
                      <option key={option.value} value={option.label}>
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

              {dropdown && (
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
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                      />

                      <Button variant="contained" onClick={handleDynamicOption}>
                        Generate Options
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
                      gap: "10px",
                    }}
                  >
                    {dynamicOptions.map((opt, index) => (
                      <Box
                        key={index}
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                      >
                        <TextField
                          id={`option-label-${index}`}
                          label="Course Label"
                          variant="outlined"
                          value={opt.label}
                          onChange={(e) =>
                            handleOptionChange(index, "label", e.target.value)
                          }
                        />
                        <TextField
                          id={`option-value-${index}`}
                          label="Fees"
                          variant="outlined"
                          value={opt.value}
                          onChange={(e) =>
                            handleOptionChange(index, "value", e.target.value)
                          }
                        />
                      </Box>
                    ))}
                  </div>
                  <Button variant="contained" onClick={handleOptionSubmission}>
                    Submit Options
                  </Button>
                </>
              )}

              {radio && (
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
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                      />
                      <Button variant="contained" onClick={handleDynamicOption}>
                        Generate Options
                      </Button>
                    </Box>
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      margin: "10px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {dynamicOptions.map((opt, index) => (
                      <Box
                        key={index}
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                      >
                        <TextField
                          id={`option-label-${index}`}
                          label={`Option ${index + 1}`}
                          variant="outlined"
                          value={radiovalue[index] || ""}
                          onChange={(e) =>
                            handleradiochange(index, e.target.value)
                          }
                        />
                      </Box>
                    ))}
                  </div>
                  <Button variant="contained" onClick={handleradiobutton}>
                    Submit Options
                  </Button>
                </>
              )}

              <Divider sx={{ marginTop: "30px" }} />

              {/* Preview Table */}
              <div style={{ padding: "10px", margin: "10px" }}>
                <Typography variant="h6">Preview of Submitted Data</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entries.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.LabelName}</TableCell>
                          <TableCell>{entry.ValueType}</TableCell>
                          <TableCell>
                            {entry.Options
                              ? // Handle different formats for options
                                Array.isArray(entry.Options)
                                ? entry.Options.map((opt, idx) =>
                                    // Handle radio options or dropdown options
                                    typeof opt === "string" ? (
                                      <div key={idx}>{opt}</div>
                                    ) : (
                                      <div key={idx}>
                                        {opt.label}: {opt.value}
                                      </div>
                                    )
                                  )
                                : "N/A"
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Button
                variant="contained"
                sx={{ backgroundColor: "#283255", margin: "30px" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Applicants Data
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {getDynamicHeaders().map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appdata.map((applicant) => (
                      <TableRow key={applicant._id}>
                        {getDynamicHeaders().map((header) => {
                          const cellValue = applicant[header];
                          return (
                            <TableCell key={header}>
                              {typeof cellValue === "object" &&
                              cellValue !== null
                                ? JSON.stringify(cellValue)
                                : cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AcademyDashboard;
