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
import IconButton from "@mui/material/IconButton";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Modal from "@mui/material/Modal";
import ApplicantsTable from "./AppliacantsTable";
import PendingFeesTable from "./PendingFeesTable";
import Loader from "../Loader/Loader";
import RegistrationForm from "./AcademyRegistration";
import MediaMenu from "../Media/MediaMenu";
import Events from "../Academy Features/Events";
import Instruments from "../Academy Features/Instruments";
import SocialLinks from "../Academy Features/SocialLinks";
import Aboutus from "../Academy Features/Aboutus";

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
  const [style, setstyle] = useState(true);
  const [pendingfeesstyle, setpendingfeesstyle] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [radio, setradio] = useState(false);
  const [displayregform, setdisplayregform] = useState(false);
  const [regstyle, setregstyle] = useState(false);
  const [togglepaymentdue, settogglepaymentdue] = useState(false);
  const [radiovalue, setradiovalue] = useState([]);
  const [defaultstyle, setdefaultstyle] = useState(false);
  const [open, setOpen] = useState(false);
  const [togglebutton, settogglebutton] = useState(false);
  const [loading, setloading] = useState(false);
  const [defaulttoggle, setdefaulttoggle] = useState(false);
  const [passpaymentdetails, setpasspaymentdetails] = useState([]);
  const [dispalymedia, setdispalymedia] = useState(false);
  const [mediastyle, setmediastyle] = useState(false);

  const [eventstyle, seteventstyle] = useState(false);
  const [event, setevent] = useState(false);

  const [about, setabout] = useState(false);
  const [aboutstyle, setaboutstyle] = useState(false);

  const [social, setsocial] = useState(false);
  const [socialstyle, setsocialstyle] = useState(false);

  const [instrument, setinstrument] = useState(false);
  const [instrumentstyle, setinstrumentstyle] = useState(false);

  const [contentmenu, setcontentmenu] = useState(false);
  const [formmenu, setformmenu] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const datatypes = [
    { value: "String", label: "String" },
    { value: "Number", label: "Number" },
    { value: "Object", label: "Dropdown List" },
    { value: "Object", label: "Radio Button" },
    { value: "Email", label: "Email Id" },
  ];

  useEffect(() => {
    handleApplicants();
  }, []);

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

  const handleClick = () => {
    setloading(true);
    setdisplayregform(true);
    setregstyle(true);
    setdispalymedia(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setmediastyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);
    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);
    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  const handleformmenu = () => {
    setformmenu(true);
  };

  const handleformenuclose = () => {
    setformmenu(false);
  };

  const handlemedia = () => {
    setmediastyle(true);
    setdispalymedia(true);
    setloading(true);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);
    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);
    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  const handlecreateform = () => {
    setloading(true);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setdispalymedia(false);
    setstyle(false);
    setdefaultstyle(true);
    setmediastyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);
    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);
    setTimeout(() => {
      setdefaulttoggle(true);
      setloading(false);
    }, 2000);
  };

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
    setDynamicOptions([]);
  };

  const handleApplicants = async () => {
    settoggleapplicants(true);
    setstyle(true);
    setregstyle(false);
    setdispalymedia(false);
    setevent(false);
    seteventstyle(false);
    settogglebutton(false);
    setdefaultstyle(false);
    setdefaulttoggle(false);
    setmediastyle(false);
    setdisplayregform(false);
    setpendingfeesstyle(false);
    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);
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
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setappdata(data);
        settogglepaymentdue(false);
        setdisplayregform(false);
        setpasspaymentdetails(false);
        toast.success("Details Fetch Success");
      }, 2000);
    } else {
      toast.error("Error fetching details");
    }
  };

  console.log(appdata);

  const handlePastApplication = async () => {
    let url = "http://localhost:5000/api/auth/getrejectedapplicant";
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
      setloading(true);
      setTimeout(() => {
        setloading(false);
        settogglebutton(true);
        setappdata(data);
        settogglepaymentdue(false);
        setdisplayregform(false);
        setpasspaymentdetails(false);
        toast.success("Details Fetch Success");
      }, 2000);
    } else {
      toast.error("Error fetching details");
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleFees = async () => {
    setappdata(false);
    setpendingfeesstyle(true);
    setregstyle(false);
    setdefaulttoggle(false);
    setevent(false);
    seteventstyle(false);
    setdispalymedia(false);
    setmediastyle(false);
    setdefaultstyle(false);
    settogglepaymentdue(true);
    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);
    setstyle(false);
    const todaydate = getCurrentDate();
    const url = "http://localhost:5000/api/auth/getpaymnetdue";
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
        currentdate: todaydate,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setdisplayregform(false);
        setpasspaymentdetails(data);
        setappdata(false);
        toast.success("Payment Details Fetch Success");
      }, 2000);
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

  const handleevent = () => {
    setloading(true);

    setmediastyle(false);
    setdispalymedia(false);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(true);
    seteventstyle(true);

    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);

    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  const handleabout = () => {
    setloading(true);

    setmediastyle(false);
    setdispalymedia(false);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);

    setabout(true);
    setaboutstyle(true);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(false);
    setsocialstyle(false);

    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  const handleinstrument = () => {
    setloading(true);

    setmediastyle(false);
    setdispalymedia(false);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);

    setabout(false);
    setaboutstyle(false);
    setinstrument(true);
    setinstrumentstyle(true);
    setsocial(false);
    setsocialstyle(false);

    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  const handlesocial = () => {
    setloading(true);

    setmediastyle(false);
    setdispalymedia(false);
    setdisplayregform(false);
    setregstyle(false);
    setappdata(false);
    setdefaultstyle(false);
    setstyle(false);
    setpendingfeesstyle(false);
    setdefaulttoggle(false);
    settogglepaymentdue(false);
    settoggleapplicants(false);
    setevent(false);
    seteventstyle(false);

    setabout(false);
    setaboutstyle(false);
    setinstrument(false);
    setinstrumentstyle(false);
    setsocial(true);
    setsocialstyle(true);

    setTimeout(() => {
      setloading(false);
    }, 2000);
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255,0.9)",
            zIndex: 9999,
          }}
        >
          <>
            <Loader />
          </>
        </div>
      )}

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

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div
          style={{
            width: "20%",
            borderRight: "2px solid black",
            backgroundColor: "#283255",
            color: "white",
          }}
        >
          {formmenu ? (
            <>
              <>
                {" "}
                <Button
                  style={{
                    color: regstyle ? "blue" : "white",
                    margin: "10px 10px 0px 0px ",
                    backgroundColor: regstyle ? "white" : "#283255",
                  }}
                  onClick={() => {
                    handleformenuclose();
                  }}
                >
                  <ArrowCircleUpIcon sx={{ marginRight: "10px" }} />
                  Form Menu
                </Button>
              </>
              <Button
                style={{
                  color: defaultstyle ? "blue" : "white",
                  margin: "10px 10px 0px 0px ",
                  backgroundColor: defaultstyle ? "white" : "#283255",
                }}
                onClick={() => {
                  handlecreateform();
                }}
              >
                Create Registration Form
              </Button>

              <Button
                style={{
                  color: regstyle ? "blue" : "white",
                  margin: "10px 10px 0px 0px ",
                  backgroundColor: regstyle ? "white" : "#283255",
                }}
                onClick={() => {
                  handleClick();
                }}
              >
                View Registration form
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button
                style={{
                  color: regstyle ? "blue" : "white",
                  margin: "10px 10px 0px 0px ",
                  backgroundColor: regstyle ? "white" : "#283255",
                }}
                onClick={() => {
                  handleformmenu();
                }}
              >
                <ArrowCircleRightIcon sx={{ marginRight: "10px" }} />
                Form Menu
              </Button>
            </>
          )}

          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: style ? "blue" : "white",
              backgroundColor: style ? "white" : "#283255",
            }}
            onClick={handleApplicants}
          >
            Applicants Data
          </Button>
          <Divider />

          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: pendingfeesstyle ? "blue" : "white",
              backgroundColor: pendingfeesstyle ? "white" : "#283255",
            }}
            onClick={() => {
              handleFees();
            }}
          >
            Pending Fees
          </Button>

          <Divider />
          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: mediastyle ? "blue" : "white",
              backgroundColor: mediastyle ? "white" : "#283255",
            }}
            onClick={() => {
              handlemedia();
            }}
          >
            Add Media
          </Button>

          <Divider />

          {/* events  */}
          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: eventstyle ? "blue" : "white",
              backgroundColor: eventstyle ? "white" : "#283255",
            }}
            onClick={() => {
              handleevent();
            }}
          >
            Add Events
          </Button>

          <Divider />

          {/* About us  */}
          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: aboutstyle ? "blue" : "white",
              backgroundColor: aboutstyle ? "white" : "#283255",
            }}
            onClick={() => {
              handleabout();
            }}
          >
            Add About us
          </Button>

          <Divider />

          {/* Add Instruments  */}
          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: instrumentstyle ? "blue" : "white",
              backgroundColor: instrumentstyle ? "white" : "#283255",
            }}
            onClick={() => {
              handleinstrument();
            }}
          >
            Add Instruments
          </Button>

          <Divider />

          {/* Add Social Media Link  */}
          <Button
            style={{
              margin: "10px",
              width: "200px",
              color: socialstyle ? "blue" : "white",
              backgroundColor: socialstyle ? "white" : "#283255",
            }}
            onClick={() => {
              handlesocial();
            }}
          >
            Add Social Links
          </Button>

          <Divider />
        </div>
        <div
          style={{
            width: "80%",
            backgroundColor: "#f3f3f5",
          }}
        >
          <div style={{ height: "auto" }}>
            {togglepaymentdue && (
              <>
                <h1
                  style={{
                    marginTop: "30px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Payment Due Details{" "}
                </h1>
                <div id="fees" style={{ margin: "60px" }}>
                  <PendingFeesTable data={passpaymentdetails} />
                </div>
              </>
            )}
            {displayregform && (
              <>
                <Box style={{ margin: "20px" }}>
                  <RegistrationForm />
                </Box>
              </>
            )}

            {event && (
              <>
                <Box style={{ margin: "20px" }}>
                  <Events />
                </Box>
              </>
            )}

            {about && (
              <>
                <Box style={{ margin: "20px" }}>
                  <Aboutus />
                </Box>
              </>
            )}

            {social && (
              <>
                <Box style={{ margin: "20px" }}>
                  <SocialLinks />
                </Box>
              </>
            )}

            {instrument && (
              <>
                <Box style={{ margin: "20px" }}>
                  <Instruments />
                </Box>
              </>
            )}

            {defaulttoggle && (
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

                        <Button
                          variant="contained"
                          onClick={handleDynamicOption}
                        >
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
                    <Button
                      variant="contained"
                      onClick={handleOptionSubmission}
                    >
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
                        <Button
                          variant="contained"
                          onClick={handleDynamicOption}
                        >
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
                  <Typography variant="h6">
                    Preview of Submitted Data
                  </Typography>
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
            )}

            {dispalymedia && (
              <>
                <MediaMenu />
              </>
            )}

            {appdata && !defaulttoggle && (
              <>
                <Typography
                  variant="h6"
                  sx={{ marginTop: "20px" }}
                  gutterBottom
                >
                  {togglebutton ? (
                    <>Existing Applicants Data</>
                  ) : (
                    <>Active Applicants Data</>
                  )}
                </Typography>
                <div
                  style={{
                    float: "right",
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography>Filters :</Typography>

                  {togglebutton ? (
                    <Button
                      variant="contained"
                      sx={{ marginLeft: "20px" }}
                      onClick={() => {
                        handleApplicants();
                      }}
                    >
                      {" "}
                      Active User
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ marginLeft: "20px" }}
                      onClick={() => {
                        handlePastApplication();
                      }}
                    >
                      Existing User
                    </Button>
                  )}
                </div>

                <div>
                  <ApplicantsTable users={appdata} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AcademyDashboard;
