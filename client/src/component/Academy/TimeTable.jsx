import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Token from "../Token/Token";
import { toast } from "react-toastify";
import PrintIcon from "@mui/icons-material/Print";
import html2canvas from "html2canvas";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const localizer = momentLocalizer(moment);
const academyname = sessionStorage.getItem("academyname");
const role = sessionStorage.getItem("role");

function Timetable() {
  const [batchData, setBatchData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [logo, setlogo] = useState("");
  const [data, setdata] = useState([]);

  const getLogo = async () => {
    const url = "http://localhost:5000/api/auth/getlogo";

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
      setlogo(data.link);
    }
  };

  useEffect(() => {
    if (academyname) {
      getLogo();
    }
  }, [academyname]);

  const handleapplicants = async (id) => {
    const token = Token();
    const url = "http://localhost:5000/api/auth/getapplicantslist";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
        batchid: id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setdata(data);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);
    }
  }, [data]);

  const handlebatches = async () => {
    const token = Token();
    const url = "http://localhost:5000/api/auth/getbatchesdetails";

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

    if (response.ok) {
      const details = await response.json();
      setBatchData(details);
    } else {
      toast.error("Error fetching batch details");
    }
  };

  const downloadStudentList = () => {
    const element = document.getElementById("student-list-print");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Student List", 14, 20);

    doc.html(element, {
      margin: [30, 20],
      x: 5,
      y: 20,
      width: 170,
      windowWidth: 700,
      callback: function (doc) {
        doc.save("student-list.pdf");
      },
    });
  };

  const printStudentList = () => {
    const printContent =
      document.getElementById("student-list-print").innerHTML;
    const newWindow = window.open();

    newWindow.document.write(`
   <html>
  <head>
    <title>Print Students List</title>
    <style>
      /* General styles */
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.6;
        background-color: #f4f4f4;
      }
      
      /* Container for the entire document */
      .container {
        width: 100%;
        margin: 0 auto;
        background-color: white;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      /* Header with logo and academy name */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #ddd;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      
      .header img {
        max-width: 150px;
        max-height: 80px;
        object-fit: contain;
      }
      
      .header .academy-name {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      } 

      .academy-name
      { 
        text-align : center ;
      }

      /* Table styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      table, th, td {
        border: 1px solid #ddd;
      }

      th, td {
        padding: 10px;
        text-align: left;
      }

      th {
        background-color: #4CAF50;
        color: white;
      }

      td {
        background-color: #f9f9f9;
      }

      /* Footer for print */
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #888;
      }

      /* Style for print version */
      @media print {
        body {
          background-color: white;
          margin: 0;
        }

        .container {
          box-shadow: none;
          margin: 0;
          padding: 0;
        }

        .header {
          border-bottom: none;
          margin-bottom: 10px;
        }

        .footer {
          margin-top: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logo}" alt="Academy Logo" />
        <div class="academy-name">${academyname}</div>
      </div>

      <div>
        ${printContent}
      </div>

      <div class="footer">
        <p>Powered by ${academyname} - All rights reserved</p>
      </div>
    </div>
  </body>
</html>

    `);
    newWindow.document.close();
    newWindow.print();
  };

  useEffect(() => {
    handlebatches();
  }, [academyname]);

  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128);
    const r = randomValue();
    const g = randomValue();
    const b = randomValue();
    return `rgb(${r}, ${g}, ${b})`;
  };

  const createEventsFromData = (batches) => {
    const events = [];
    const currentMonthStart = moment().startOf("month");
    const currentMonthEnd = moment().endOf("month");

    batches.forEach((batch) => {
      const batchColor = getRandomColor();
      batch.days.forEach((day) => {
        let startDate = currentMonthStart.clone().day(day);
        if (startDate.isBefore(currentMonthStart)) {
          startDate = startDate.add(1, "week");
        }

        while (startDate.isBefore(currentMonthEnd)) {
          const start = startDate
            .set({
              hour: moment(batch.starttime, "HH:mm").hour(),
              minute: moment(batch.starttime, "HH:mm").minute(),
            })
            .toDate();

          const end = startDate
            .set({
              hour: moment(batch.endtime, "HH:mm").hour(),
              minute: moment(batch.endtime, "HH:mm").minute(),
            })
            .toDate();

          events.push({
            title: `${batch.batchname} (${batch.batchtype})`,
            start,
            end,
            allDay: false,
            color: batchColor,
            batchid: batch._id,
            days: batch.days,
            theorydays: batch.theorydays,
            practicaldays: batch.practicaldays,
            batchtiming: `${batch.starttime} - ${batch.endtime}`,
          });

          startDate.add(1, "week");
        }
      });
    });

    return events;
  };

  const events = createEventsFromData(batchData);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedBatchId(event.batchid);
    setOpenDialog(true);
    handleapplicants(event.batchid);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "50px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Monthly Timetable
      </h2>
      <div id="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="month"
          views={["month", "week", "day"]}
          step={60}
          timeslots={1}
          defaultDate={new Date()}
          style={{ height: "100vh" }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: "white",
              borderRadius: "5px",
              padding: "5px",
              border: "none",
              cursor: "pointer",
            },
          })}
          onSelectEvent={handleEventClick}
        />
      </div>
      {selectedEvent && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <div>
            <Button sx={{ float: "right !important" }}>
              <PrintIcon
                onClick={printStudentList}
                variant="contained"
                color="primary"
              />
            </Button>

            <Button sx={{ float: "right", marginRight: "10px" }}>
              <DownloadIcon
                onClick={downloadStudentList}
                variant="contained"
                color="primary"
              />
            </Button>
          </div>
          <div id="student-list-print">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <DialogTitle>Applicants List</DialogTitle>
              <DialogTitle> Batch Details : </DialogTitle>

              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography style={{ fontWeight: "bold" }}>
                    {" "}
                    Batch Name :{" "}
                  </Typography>
                  <Typography>{selectedEvent.title}</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "30px",
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {" "}
                    Batch Timings :{" "}
                  </Typography>
                  <Typography>{selectedEvent.batchtiming}</Typography>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  marginRight: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "30px",
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {" "}
                    Batch Days :{" "}
                  </Typography>
                  <Typography>{selectedEvent.days.join(" - ")}</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "30px",
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {" "}
                    Practical Days :{" "}
                  </Typography>
                  <Typography>
                    {selectedEvent.practicaldays.join("-")}
                  </Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "20px",
                  }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {" "}
                    Theory Days :{" "}
                  </Typography>
                  <Typography>{selectedEvent.theorydays.join("-")}</Typography>
                </div>
              </div>
            </div>

            <DialogContent sx={{ marginTop: "20px" }}>
              <TableContainer component={Paper}>
                <Table>
                  {data.length > 0 ? (
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Mobile No</TableCell>
                          <TableCell>Course</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((applicant) => (
                          <TableRow key={applicant._id}>
                            <TableCell>
                              {applicant.additionalFields.formdata.Name}
                            </TableCell>
                            <TableCell>
                              {applicant.additionalFields.formdata.MobileNo}
                            </TableCell>
                            <TableCell>
                              {applicant.additionalFields.formdata.Courses}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ padding: "10px" }}>
                        No Students Available For This Batch
                      </Typography>
                    </>
                  )}
                </Table>
              </TableContainer>
            </DialogContent>
          </div>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default Timetable;
