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
  const [data, setdata] = useState([]);

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
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          ${printContent}
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
