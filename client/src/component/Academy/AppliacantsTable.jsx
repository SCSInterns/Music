import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Token from "../Token/Token";
import PaymentDetails from "./PaymentDetails";

const ApplicantsTable = ({ users }) => {
  const [data, setData] = useState();
  const [toggle, setToggle] = useState(false);
  const [toggleinstallment, settoggleinstallment] = useState(false);
  const [paymnetaddbox, setpaymnetaddbox] = useState(false);
  const hasUsers = users && users.length > 0;
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const [paymentmode, setpaymentmode] = useState("");
  const [paymentdate, setpaymentdate] = useState("");
  const [installmentstate, setinstallmentstate] = useState({
    studentid: "",
    username: "",
  });
  const [actiontoggle, setactiontoggle] = useState(true);
  const [paymentdetails, setpaymentdetails] = useState({
    academyname: `${academyname}`,
    course: "",
    amount: "",
    role: `${role}`,
    studentname: "",
    enrollmentDate: "",
    paymentmode: "",
    studentemail: "",
  });

  useEffect(() => {
    if (data) {
      setpaymentdetails({
        ...paymentdetails,
        course: data.additionalFields?.formdata?.Courses,
        amount: data.additionalFields?.fees,
        studentname: data.additionalFields?.formdata?.Name,
        studentemail: data.additionalFields.formdata?.Email,
      });
    }
  }, [data]);

  useEffect(() => {
    setpaymentdetails({
      ...paymentdetails,
      paymentmode: paymentmode,
    });
  }, [paymentmode]);

  useEffect(() => {
    setpaymentdetails({
      ...paymentdetails,
      enrollmentDate: convertDateFormat(paymentdate),
    });
  }, [paymentdate]);

  const handleChange = (event) => {
    setpaymentmode(event.target.value);
  };

  const handleactiontoggle = async (action) => {
    setactiontoggle(action);
  };

  const convertDateFormat = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);

    const formattedDate = [
      String(dateObj.getDate()).padStart(2, "0"),
      String(dateObj.getMonth() + 1).padStart(2, "0"),
      dateObj.getFullYear(),
    ].join("-");

    return formattedDate;
  };

  const handleinstallmentsubmition = async (id) => {
    if (paymentdetails.enrollmentDate === "NaN-NaN-NaN") {
      toast.error("Please enter the date of payment");
      return;
    }

    if (paymentdetails.paymentmode === "") {
      toast.error("Please enter the mode of payment");
      return;
    }

    const url = `http://localhost:5000/api/auth/addpaymentdetails/${id}`;

    let token = Token();
    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: paymentdetails.academyname,
          course: paymentdetails.course,
          amount: paymentdetails.amount,
          role: paymentdetails.role,
          studentname: paymentdetails.studentname,
          enrollmentDate: paymentdetails.enrollmentDate,
          paymentmode: paymentdetails.paymentmode,
          studentemail: paymentdetails.studentemail,
        }),
      });

      if (response.ok) {
        toast.success("Payment Data Added Successfully ");
        setinstallmentstate({
          studentid: data._id,
          username: data.additionalFields.formdata?.Name,
        });
        setpaymentdate("");
        setpaymentmode(""); 

        setpaymnetaddbox(false)
        settoggleinstallment(true) 
      } else {
        toast.error("Payment Details Updation Failed ");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handlePreview = async (id) => {
    const url = `http://localhost:5000/api/auth/getdatabyid/${id}`;
    let token = Token();
    let role = sessionStorage.getItem("role");

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setinstallmentstate({
          studentid: responseData._id,
          username: responseData.additionalFields.formdata?.Name,
        });
        toast.success("Details Fetch Success");
        setToggle(true);
        if (responseData.status === "Accept") {
          settoggleinstallment(true);
        } else {
          settoggleinstallment(false);
        }
      } else {
        toast.error("Error fetching info");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleClose = () => {
    setToggle(false);
    setData(null);
  };

  const handleinstallment = async (id) => {
    const url = `http://localhost:5000/api/auth/updateinstallment/${id}`;
    const token = Token();
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${currentDate.getFullYear()}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: formattedDate }),
    });

    if (response.ok) {
      toast.success("Installment Date Updated Success");
    } else {
      toast.error("Installment Date Updation Failed");
    }
  };

  const handleclick = async (status, id) => {
    const url = `http://localhost:5000/api/auth/updatestatus/${id}`;
    const token = Token();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    });

    if (response.ok) {
      toast.success("Status updated successfully");
      await handleinstallment(id);
      handlePreview(id);
    } else {
      toast.error("Status updation failed ");
    }

    if (response.status === "Accept") {
      settoggleinstallment(true);
    } else {
      settoggleinstallment(false);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: "90%", margin: "auto", marginTop: "100px" }}
      >
        {hasUsers ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>More Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.additionalFields.formdata?.Name}</TableCell>
                  <TableCell>{user.additionalFields.formdata?.Email}</TableCell>
                  <TableCell>
                    {user.additionalFields.formdata?.MobileNo}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handlePreview(user._id)}>
                      <AccountCircleIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </TableContainer>

      {/* Preview Modal */}
      <Dialog
        open={toggle}
        onClose={handleClose}
        aria-labelledby="preview-dialog-title"
        aria-describedby="preview-dialog-description"
        fullWidth={true}
        maxWidth="xl" // "xl" will make the dialog cover almost the full screen width
      >
        <DialogTitle id="preview-dialog-title" sx={{ fontWeight: "bold" }}>
          Detailed Information
        </DialogTitle>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogContent>
            <DialogContentText id="preview-dialog-description">
              {data ? (
                <>
                  <div style={{ display: "flex" }}>
                    <PortraitIcon
                      sx={{
                        height: "200px",
                        width: "200px",
                        color: "#283255",
                        marginRight: "50px",
                      }}
                    />
                    <div style={{ marginRight: "50px" }}>
                      {/* Render fields dynamically */}

                      <Grid container spacing={2}>
                        {Object.entries(data.additionalFields.formdata).map(
                          ([label, value], index) => (
                            <Grid item xs={12} sm={4} key={index}>
                              {" "}
                              {/* Set 3 columns with xs={12} for mobile and sm={4} for larger screens */}
                              <Typography>
                                <strong>{label}</strong>: {value || "N/A"}
                              </Typography>
                            </Grid>
                          )
                        )}
                      </Grid>

                      {/* Fees */}
                      <Typography sx={{ marginTop: "20px" }}>
                        <strong> Fees </strong> :{" "}
                        {data.additionalFields.fees || "N/A"}
                      </Typography>

                      {/* <Divider sx={{ marginTop: "30px", marginBottom: "20px"}} />  */}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        // borderLeft: "2px solid black",
                        paddingLeft: "20px",
                      }}
                    >
                      {/* Status */}

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography>
                          {" "}
                          <strong>Status</strong> : {data.status}
                        </Typography>

                        {actiontoggle ? (
                          <>
                            <Button
                              onClick={() => {
                                handleactiontoggle(false);
                              }}
                            >
                              <ArrowCircleUpIcon />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                handleactiontoggle(true);
                              }}
                            >
                              <ArrowCircleDownIcon />
                            </Button>
                          </>
                        )}
                      </div>
                      {/* Action buttons */}
                      {actiontoggle && (
                        <>
                          <div
                            style={{
                              padding: "10px",
                              margin: "10px",
                              display: "flex",
                            }}
                          >
                            {/* Accept button */}
                            {data.status !== "Accept" && (
                              <Button
                                variant="contained"
                                onClick={() => handleclick("Accept", data._id)}
                                sx={{ marginLeft: "20px" }}
                              >
                                Accept
                              </Button>
                            )}

                            {/* Reject button */}
                            {data.status !== "Reject" && (
                              <Button
                                variant="contained"
                                onClick={() => handleclick("Reject", data._id)}
                                sx={{ marginLeft: "20px" }}
                              >
                                Reject
                              </Button>
                            )}

                            {/* Hold button */}
                            {data.status !== "Hold" && (
                              <Button
                                variant="contained"
                                onClick={() => handleclick("Hold", data._id)}
                                sx={{ marginLeft: "20px" }}
                              >
                                Hold
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Divider sx={{ marginTop: "30px", marginBottom: "30px" }} />

                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    {data.status === "Reject" ? (
                      <>
                        <Button
                          variant="contained"
                          disabled
                          onClick={() => {
                            setpaymnetaddbox(true);
                            settoggleinstallment(false);
                          }}
                        >
                          Add Payment
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            setpaymnetaddbox(true);
                            settoggleinstallment(false);
                          }}
                        >
                          Add Payment
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => {
                        settoggleinstallment(true);
                        setpaymnetaddbox(false);
                      }}
                    >
                      Payment History
                    </Button>
                  </div>

                  <Divider sx={{ marginTop: "20px", marginBottom: "20px" }} />

                  {paymnetaddbox && (
                    <>
                      <h1 style={{ fontWeight: "Bold", marginBottom: "20px" }}>
                        Installment Info Here :{" "}
                      </h1>

                      <Typography>
                        <strong>Student Name </strong>:{" "}
                        {data.additionalFields.formdata?.Name}
                      </Typography>

                      <Typography>
                        <strong>Installment Date </strong>:{" "}
                        {data.installementDate}
                      </Typography>

                      <Typography>
                        <strong>Course </strong>:{" "}
                        {data.additionalFields.formdata?.Courses}
                      </Typography>
                      <Typography>
                        <strong>Installment Amount </strong> :{" "}
                        {data.additionalFields.fees}
                      </Typography>
                      <Typography>
                        <strong>Payment Date </strong>:
                        <input
                          type="date"
                          id="datePicker"
                          name="datePicker"
                          onChange={(e) => setpaymentdate(e.target.value)}
                        ></input>
                      </Typography>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography>
                          <strong>Payment Mode</strong> :
                        </Typography>

                        <Box sx={{ minWidth: 500, marginTop: "10px" }}>
                          <FormControl
                            sx={{ width: "50%", marginLeft: "30px" }}
                          >
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={paymentmode}
                              label="Age"
                              onChange={handleChange}
                            >
                              <MenuItem value={"Debit / Credit Card"}>
                                Debit / Credit Card
                              </MenuItem>
                              <MenuItem value={"Cash"}>Cash</MenuItem>
                              <MenuItem value={"Cheque"}>Cheque</MenuItem>
                              <MenuItem value={"Upi"}>Upi</MenuItem>
                            </Select>
                          </FormControl>
                          <p
                            style={{
                              fontSize: "12px",
                              marginLeft: "30px",
                              color: "#283255",
                            }}
                          >
                            Please select payment mode here *{" "}
                          </p>
                        </Box>
                      </div>

                      <Button
                        variant="contained"
                        sx={{ marginTop: "20px" }}
                        onClick={() => handleinstallmentsubmition(data._id)}
                      >
                        Submit
                      </Button>

                      {/* <Divider
                        sx={{ marginTop: "20px", marginBottom: "20px" }}
                      /> */}
                    </>
                  )}

                  {toggleinstallment && (
                    <>
                      <Typography sx={{ fontWeight: "Bold" }}>
                        Payment Info :
                      </Typography>

                      {<PaymentDetails data={installmentstate} />}
                    </>
                  )}
                </>
              ) : (
                <Typography>No information available.</Typography>
              )}
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicantsTable;
