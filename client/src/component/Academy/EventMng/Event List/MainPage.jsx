import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Button,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PreviewIcon from "@mui/icons-material/Preview";

const eventData = [
  {
    _id: "67b82ab41aceba6650c63d9a",
    eventname: "Kisi Ko Batana Mat Ft. Anubhav Singh Bassi",
    live: true,
    academyname: "Spectrum",
    banner:
      "https://res.cloudinary.com/dipnrfd3h/image/upload/v1740122576/eventbanners/eaj3vymud6igxfstun3f.avif",
    eventcategory: "Performances",
    occurancetype: "Single",
    venuetype: "Auditorium",
    eventdescription:
      "Get ready for an unforgettable evening of laughter and entertainment!...",
    seatlayouturl:
      "https://res.cloudinary.com/dipnrfd3h/image/upload/v1740123250/EventLayout/canvas_image.png",
    totalSeats: 500,
    eventSchedule: [
      {
        date: "02-03-2025",
        startTime: "18:00",
        endTime: "20:00",
        venueid: "6798c4242892b4dc4bd89c21",
      },
    ],
    plans: [
      { planName: "Premium Seating", pricePerSeat: 1500, maxSeats: 100 },
      { planName: "Gold Seating", pricePerSeat: 1000, maxSeats: 100 },
      { planName: "Silver Seating", pricePerSeat: 500, maxSeats: 300 },
    ],
  },
];

// start from here -- data dynamic

export default function EventTableWithPreview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handlePreviewClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Academy Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Venue Type</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventData.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.eventname}</TableCell>
                <TableCell>{event.academyname}</TableCell>
                <TableCell>{event.eventcategory}</TableCell>
                <TableCell>{event.venuetype}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handlePreviewClick(event)}
                  >
                    <PreviewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <div className="flex justify-between items-center">
          <DialogTitle>{selectedEvent?.eventname}</DialogTitle>
          <DialogActions className="mr-4 !p-0 !w-fit">
            <CloseIcon
              onClick={handleCloseDialog}
              className="hover:text-white hover:bg-red-500 !border !size-7 p-1 rounded-lg border-red-600 text-red-600 cursor-pointer"
              fontSize="small"
            />
          </DialogActions>
        </div>
        <DialogContent dividers>
          {selectedEvent && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <img
                  src={selectedEvent.banner}
                  alt="Event Banner"
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Event Details</Typography>
                <Typography variant="body" className="text-gray-600">
                  {selectedEvent.eventdescription}
                </Typography>
                <Typography variant="subtitle1" className="mt-4 font-semibold">
                  Venue Type: {selectedEvent.venuetype}
                </Typography>
                <Typography variant="subtitle1">
                  Total Seats: {selectedEvent.totalSeats}
                </Typography>
                <Typography variant="subtitle1" className="font-semibold">
                  Schedule:
                </Typography>
                {selectedEvent.eventSchedule.map((schedule, idx) => (
                  <Typography variant="body2" key={idx}>
                    {schedule.date} | {schedule.startTime} - {schedule.endTime}
                  </Typography>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="font-semibold">
                  Seating Plans
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Plan Name</TableCell>
                      <TableCell className="font-bold">Price (INR)</TableCell>
                      <TableCell className="font-bold">Max Seats</TableCell>
                      <TableCell className="font-bold">Ticket Booked</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEvent.plans.map((plan, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{plan.planName}</TableCell>
                        <TableCell>{plan.pricePerSeat}</TableCell>
                        <TableCell>{plan.maxSeats}</TableCell>
                        <TableCell>{plan.ticketbooked || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
