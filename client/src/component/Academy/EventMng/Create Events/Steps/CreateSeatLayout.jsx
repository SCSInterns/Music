import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Container,
  Typography,
  Paper,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Armchair } from "lucide-react";
import Token from "../../../../Token/Token";
import { toast } from "react-toastify";
import { nextStep } from "../../../../Features/StepperSlice";
import { useDispatch, useSelector } from "react-redux";
import DrawingCanvas from "../CreateLayout/DrwaingCanvas";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateFormData } from "../../../../Features/EventsSlice";

const SeatForm = () => {
  const [formData, setFormData] = useState({
    noofrows: "",
    noofpartition: "",
  });
  const SeatData = useSelector((state) => state.event);
  const [seatsPerPartition, setSeatsPerPartition] = useState([]);
  const [maxSeatsPerPartition, setMaxSeatsPerPartition] = useState([]);
  const [order, setorder] = useState("Ascending");
  const [seatLayout, setSeatLayout] = useState("no");
  const token = Token();
  const dispatch = useDispatch();
  const StoredformData = useSelector((state) => state.event);
  const [layout, setlayout] = useState(null);
  const [layoutpreview, setlayoutpreview] = useState(null);

  console.log(SeatData.eventid);

  const handleLayoutChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setlayout(file);
      setlayoutpreview(URL.createObjectURL(file));
    }
  };

  const handleSeatLayoutChange = (event) => {
    setSeatLayout(event.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePartitionSeatsChange = (rowIndex, partitionIndex, value) => {
    const updatedSeats = [...seatsPerPartition];
    if (!updatedSeats[rowIndex]) updatedSeats[rowIndex] = [];
    updatedSeats[rowIndex][partitionIndex] = value;
    setSeatsPerPartition(updatedSeats);
  };

  const handlelayoutsubmit = async (file) => {
    if (SeatData.eventid === "") {
      toast.error("Please complete the previous step before proceeding");
      return;
    }
    const url = "http://localhost:5000/api/auth/uploadeventlayoutimage";

    const formData = new FormData();
    formData.append("picture", file);
    formData.append("eventid", SeatData.eventid);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      toast.success("Image Uploaded Successfully");
      dispatch(nextStep());
    } else {
      toast.error(" Image Upload Failed");
    }
  };

  useEffect(() => {
    const updatedSeats = Array.from({ length: Number(formData.noofrows) }, () =>
      Array(Number(formData.noofpartition)).fill(0)
    );
    setSeatsPerPartition(updatedSeats);

    const maxSeats = Array(Number(formData.noofpartition)).fill(0);
    setMaxSeatsPerPartition(maxSeats);
  }, [formData.noofpartition, formData.noofrows]);

  useEffect(() => {
    const maxSeats = Array(Number(formData.noofpartition)).fill(0);
    seatsPerPartition.forEach((row) => {
      row.forEach((seatCount, partitionIndex) => {
        maxSeats[partitionIndex] = Math.max(
          maxSeats[partitionIndex],
          Number(seatCount) || 0
        );
      });
    });

    setMaxSeatsPerPartition(maxSeats);
  }, [seatsPerPartition, formData.noofpartition]);

  const handlesubmit = async () => {
    if (SeatData.eventid === "") {
      toast.error("Please complete the previous step before proceeding");
      return;
    }
    const url = "http://localhost:5000/api/auth/createseatlayout";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        academyid: sessionStorage.getItem("academyid"),
        role: sessionStorage.getItem("role"),
        noofrows: formData.noofrows,
        noofpartition: formData.noofpartition,
        seatsPerPartition: seatsPerPartition,
        maxSeatsPerPartition: maxSeatsPerPartition,
        seatingorientation: order,
        eventid: SeatData.eventid,
        planname: "Default",
        priceperseat: 100,
      }),
    });

    const data = await response.json();
    const message = await data.message;
    if (response.ok) {
      dispatch(
        updateFormData({
          seatlayoutid: response._id,
        })
      );
      toast.success(message);
      formData.noofrows = "";
      formData.noofpartition = "";
      setSeatsPerPartition([]);
      setMaxSeatsPerPartition([]);
      setorder("Ascending");
      dispatch(nextStep());
    } else {
      toast.error(message);
    }
  };

  console.log(seatsPerPartition);
  console.log(maxSeatsPerPartition);

  return (
    <Container maxWidth="md" className="my-5">
      <div className="my-5 text-left">
        <Typography>
          Venue Type : <span className="font-bold"> {SeatData.venuetype}</span>
        </Typography>
      </div>

      <div>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <div className="flex space-x-5 flex-row items-center  my-3">
                <FormLabel component="legend">Set Seat Layout ? :</FormLabel>
                <RadioGroup
                  aria-label="seat-layout"
                  name="seatLayout"
                  value={seatLayout}
                  onChange={handleSeatLayoutChange}
                  sx={{ display: "flex", gap: 3, flexDirection: "row" }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      {seatLayout === "yes" && (
        <>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Number of Rows"
                  name="noofrows"
                  type="number"
                  value={formData.noofrows}
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Number of Partitions"
                  name="noofpartition"
                  type="number"
                  value={formData.noofpartition}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="venue-label">Select Seat Order</InputLabel>
                  <Select
                    labelId="venue-label"
                    name="form-venue"
                    onChange={(e) => setorder(e.target.value)}
                  >
                    <MenuItem key={1} value={"Ascending"}>
                      Ascending(A-Z)
                    </MenuItem>
                    <MenuItem key={2} value={"Descdending"}>
                      Descdending(Z-A)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>

          {formData.noofrows && formData.noofpartition && (
            <Paper
              elevation={2}
              sx={{
                marginY: 10,
                padding: 5,
                borderRadius: 2,
                backgroundColor: "#f1f5f9",
                overflowX: "auto",
              }}
            >
              <Typography className="text-sm my-4" align="center" gutterBottom>
                Seat Preview
              </Typography>

              {/* Scrollable Table Section */}
              <div
                style={{ overflowX: "auto", paddingBottom: "10px" }}
                className="no-scrollbar"
              >
                <Grid container spacing={1} ml={2}>
                  <Grid container item spacing={2} alignItems="center">
                    <Grid item sx={{ width: "80px" }}>
                      {" "}
                      <p>Row </p>
                    </Grid>
                    {Array.from({ length: Number(formData.noofpartition) }).map(
                      (_, partition) => (
                        <Grid
                          item
                          key={partition}
                          sx={{ textAlign: "center", flex: "1 1 0" }}
                        >
                          <Typography className="font-bold">
                            Partition {partition + 1}
                          </Typography>
                        </Grid>
                      )
                    )}
                  </Grid>

                  {Array.from({ length: Number(formData.noofrows) }).map(
                    (_, row) => (
                      <Grid
                        container
                        item
                        spacing={2}
                        alignItems="center"
                        key={row}
                      >
                        <Grid item sx={{ width: "80px", textAlign: "center" }}>
                          <Typography>{row + 1}</Typography>
                        </Grid>

                        {Array.from({
                          length: Number(formData.noofpartition),
                        }).map((_, partition) => (
                          <Grid
                            item
                            key={partition}
                            sx={{ textAlign: "center", flex: "1 1 0" }}
                          >
                            <TextField
                              type="number"
                              size="small"
                              value={seatsPerPartition[row]?.[partition] || ""}
                              onChange={(e) =>
                                handlePartitionSeatsChange(
                                  row,
                                  partition,
                                  e.target.value
                                )
                              }
                              inputProps={{ min: 0 }}
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )
                  )}
                </Grid>
              </div>

              {/* Seat Layout Preview */}
              <Grid
                container
                spacing={2}
                direction="column"
                sx={{ mt: 3, ml: 4 }}
              >
                <div className="flex flex-col items-center justify-center">
                  <p>All eyes this way</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 50"
                    width="300"
                    height="100"
                  >
                    <path
                      d="M10 25 Q50 0, 90 25"
                      fill="transparent"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {seatsPerPartition.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <Grid
                      container
                      alignItems="center"
                      sx={{
                        display: "flex",
                        flexWrap: "nowrap",
                        gap: 5,
                        mt: 2,
                      }}
                    >
                      {order === "Ascending" ? (
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {String.fromCharCode(rowIndex + 65)}
                        </Typography>
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {String.fromCharCode(
                            65 + (Number(formData.noofrows) - 1 - rowIndex)
                          )}
                        </Typography>
                      )}

                      {row.map((seatCount, partitionIndex) => (
                        <Grid
                          item
                          key={`${rowIndex}-${partitionIndex}`}
                          sx={{
                            width: `${
                              maxSeatsPerPartition[partitionIndex] * 30
                            }px`,
                            minWidth: "70px",
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            // justifyContent:
                            //   partitionIndex % 2 !== 0 ? "center" : "center",
                            justifyContent:
                              partitionIndex % 2 !== 0
                                ? "flex-start"
                                : "flex-end",
                          }}
                        >
                          {Array.from({ length: Number(seatCount) }).map(
                            (_, i) => (
                              <Tooltip
                                key={`${rowIndex}-${partitionIndex}-${i}`}
                                title={`${String.fromCharCode(
                                  rowIndex + 65
                                )}- P${partitionIndex + 1} - Seat ${i + 1}`}
                              >
                                <Armchair
                                  style={{
                                    color: "#4caf50",
                                    cursor: "pointer",
                                    width: "18px",
                                    height: "18px",
                                  }}
                                />
                              </Tooltip>
                            )
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Grid>
            </Paper>
          )}

          <Button
            variant="contained"
            onClick={() => {
              handlesubmit();
            }}
            sx={{ float: "right", my: 2 }}
            disabled={
              seatsPerPartition.length === 0 &&
              maxSeatsPerPartition.length === 0
            }
          >
            Submit & Next
          </Button>
        </>
      )}

      {seatLayout === "no" && (
        <>
          <DrawingCanvas onSubmit={handlelayoutsubmit} />
        </>
      )}
    </Container>
  );
};

export default SeatForm;
