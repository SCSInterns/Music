import React, { useEffect, useState } from "react";
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
import Token from "../../../Token/Token";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";

export default function EventTableWithPreview() {
  const token = Token();
  const role = sessionStorage.getItem("role");
  const academyname = sessionStorage.getItem("academyname");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, seteventData] = useState({});

  const handlePreviewClick = (event) => {
    console.log(event);
    if (!event.seatlayouturl) {
      console.log(event.seatlayoutid[0]);
    }

    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const fetchEventDetails = async () => {
    const url = "http://localhost:5000/api/auth/geteventslistforacademy";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ role: role, academyname: academyname }),
    });
    const data = await response.json();
    if (response.ok) {
      seteventData(data);
    } else {
      const message = data.message;
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const columns = [
    {
      header: "Sr. No",
      accessorKey: "srNo",
      Cell: ({ row }) => row.index + 1,
      size: 80,
    },
    {
      accessorKey: "eventname",
      header: "Event Name",
      size: 300,
    },
    {
      accessorKey: "eventcategory",
      header: "Category",
    },
    {
      accessorKey: "venuetype",
      header: "Venue Type",
    },
    {
      accessorKey: "preview",
      header: "Preview",
      Cell: ({ row }) => (
        <IconButton
          color="primary"
          onClick={() => handlePreviewClick(row.original)}
        >
          <PreviewIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="p-4">
      <TableContainer component={Paper}>
        <MaterialReactTable columns={columns} data={eventData} />
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
                <Typography
                  variant="body"
                  className="text-gray-600 line-clamp-4"
                >
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
                  Ticket Plans
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
