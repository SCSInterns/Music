import React, { useEffect, useState } from "react";
import Token from "../../../../Token/Token";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { Armchair } from "lucide-react";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";
import { nextStep } from "../../../../Features/StepperSlice";
import { useDispatch, useSelector } from "react-redux";

function CreateTickets() {
  const [formdata, setformdata] = useState([]);
  const [open, setopen] = useState(false);
  const [plans, setPlans] = useState([{ planName: "", pricePerSeat: "" }]);
  const dispatch = useDispatch();
  const [seatLayout, setSeatLayout] = useState("no");
  const [seatlayoutpopup, setseatlayoutpopup] = useState(false);
  const formData = useSelector((state) => state.event);
  const eventid = formData.eventid;

  console.log(plans);
  console.log(eventid);

  const getlayout = async () => {
    if (eventid === "") {
      toast.error("Please Complete Previous Step");
      return;
    }
    const url = "http://localhost:5000/api/auth/getseatlayout";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Token()}`,
      },
      body: JSON.stringify({
        eventid: eventid,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setformdata({
        ...data.seatlayout[0],
        plansPerRow: [],
      });
    } else {
      toast.error("Error Fetching Details");
    }
  };

  useEffect(() => {
    getlayout();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPlans = [...plans];
    updatedPlans[index][name] = value;
    setPlans(updatedPlans);
  };

  const addPlan = () => {
    if (plans.length < 5) {
      setPlans([...plans, { planName: "", pricePerSeat: "" }]);
    } else {
      toast.error("Maximum 5 plans allowed.");
    }
  };

  console.log(formdata);

  const removePlan = (index) => {
    if (plans.length > 1) {
      const updatedPlans = plans.filter((_, i) => i !== index);
      setPlans(updatedPlans);
    } else {
      toast.error("At least one plan is required.");
    }
  };

  const handlePlanChange = (rowIndex, selectedPlan) => {
    setformdata((prevData) => {
      const updatedPlans = [...prevData.plansPerRow];
      updatedPlans[rowIndex] = {
        planName: selectedPlan.planName,
        pricePerSeat: selectedPlan.pricePerSeat,
      };
      return {
        ...prevData,
        plansPerRow: updatedPlans,
      };
    });
  };

  const handleSubmit = () => {
    if (plans.some((plan) => !plan.planName || !plan.pricePerSeat)) {
      toast.error("All fields are required!");
      return;
    }

    console.log("Submitted Plans:", plans);
    setopen(true);
    toast.success("Plans submitted successfully!");
  };

  const handleSeatLayoutChange = (event) => {
    setSeatLayout(event.target.value);
    if (event.target.value === "yes") {
      setseatlayoutpopup(true);
    } else {
      setseatlayoutpopup(false);
    }
  };

  const handleplansubmit = async () => {
    const url = "http://localhost:5000/api/auth/insertpricingplans";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Token()}`,
      },
      body: JSON.stringify({
        eventid: eventid,
        plans: plans,
      }),
    });

    if (response.ok) {
      toast.success("Plans added successfully!");
      dispatch(nextStep());
    } else {
      toast.error("Error adding plans!");
    }
  };

  return (
    <div className="space-y-4">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          gap: 2,
        }}
      >
        {plans.map((plan, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <TextField
              label="Plan Name"
              name="planName"
              value={plan.planName}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <TextField
              label="Price per Seat"
              name="pricePerSeat"
              type="number"
              value={plan.pricePerSeat}
              onChange={(e) => handleChange(index, e)}
              required
            />
            {plans.length > 1 && (
              <IconButton onClick={() => removePlan(index)} color="error">
                <Delete />
              </IconButton>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={addPlan}
              disabled={plans.length >= 5}
            >
              <Plus />
            </Button>
          </Box>
        ))}
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "150px", float: "right", marginY: 10 }}
        disabled={plans.length === 1}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit Plans
      </Button>

      {open && (
        <div>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <div className="flex space-x-5 flex-row items-center  my-3">
                  <FormLabel component="legend">
                    Pricig according to seat layout ? :
                  </FormLabel>
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
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </div>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      )}

      {seatlayoutpopup && (
        <>
          <div className="my-10">
            {formdata.noofrows && formdata.noofpartition && (
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
                <Typography
                  className="text-sm !my-6"
                  align="center"
                  gutterBottom
                >
                  Seat Preview
                </Typography>

                <div
                  style={{ overflowX: "auto", paddingBottom: "10px" }}
                  className="no-scrollbar"
                >
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      {/* Table Head */}
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              Row
                            </Typography>
                          </TableCell>
                          {Array.from({
                            length: Number(formdata.noofpartition),
                          }).map((_, partition) => (
                            <TableCell key={partition} align="center">
                              <Typography variant="subtitle1" fontWeight="bold">
                                Partition {partition + 1}
                              </Typography>
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              Plan
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      {/* Table Body */}
                      <TableBody>
                        {Array.from({ length: Number(formdata.noofrows) }).map(
                          (_, row) => (
                            <TableRow key={row}>
                              {/* Row Number */}
                              <TableCell align="center">
                                <Typography>{row + 1}</Typography>
                              </TableCell>

                              {/* Partitions */}
                              {Array.from({
                                length: Number(formdata.noofpartition),
                              }).map((_, partition) => (
                                <TableCell key={partition} align="center">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={
                                      formdata.seatsPerPartition[row]?.[
                                        partition
                                      ] || ""
                                    }
                                    inputProps={{ min: 0, readOnly: true }}
                                    sx={{ width: "60px" }}
                                  />
                                </TableCell>
                              ))}

                              {/* Plan Selection */}
                              <TableCell align="center" width={"50% "}>
                                <FormControl fullWidth>
                                  <InputLabel>Select Plan</InputLabel>
                                  <Select
                                    value={
                                      formdata.plansPerRow[row]?.planName || ""
                                    }
                                    onChange={(e) => {
                                      const selectedPlan = plans.find(
                                        (plan) =>
                                          plan.planName === e.target.value
                                      );
                                      handlePlanChange(row, selectedPlan);
                                    }}
                                  >
                                    {plans.map((plan) => (
                                      <MenuItem
                                        key={plan.pricePerSeat}
                                        value={plan.planName}
                                      >
                                        {plan.planName} (₹{plan.pricePerSeat})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Paper>
            )}
          </div>

          <Grid container spacing={2} direction="column" sx={{ mt: 3, ml: 4 }}>
            <div className="flex flex-col items-center justify-start">
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

            {Array.isArray(formdata.plansPerRow) &&
              Array.from(
                new Set(formdata.plansPerRow.map((plan) => plan.planName))
              ).map((planName) => (
                <div key={planName} style={{ marginBottom: "20px" }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      mt: 2,
                      color: "grey",
                      fontSize: "14px",
                    }}
                  >
                    Rs.{" "}
                    {
                      formdata.plansPerRow.find((p) => p.planName === planName)
                        ?.pricePerSeat
                    }{" "}
                    {planName.toUpperCase()}{" "}
                  </Typography>
                  <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
                  {formdata.seatsPerPartition
                    .map((row, rowIndex) => ({ row, rowIndex }))
                    .filter(
                      ({ rowIndex }) =>
                        formdata.plansPerRow[rowIndex]?.planName === planName
                    )
                    .map(({ row, rowIndex }) => (
                      <div key={rowIndex}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            display: "flex",
                            flexWrap: "nowrap",
                            gap: 5,
                            mt: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {formdata.seatingorientation === "Ascending"
                              ? String.fromCharCode(rowIndex + 65)
                              : String.fromCharCode(
                                  65 +
                                    (Number(formdata.noofrows) - 1 - rowIndex)
                                )}
                          </Typography>

                          {row.map((seatCount, partitionIndex) => (
                            <Grid
                              item
                              key={`${rowIndex}-${partitionIndex}`}
                              sx={{
                                width: `${
                                  formdata.maxSeatsPerPartition[
                                    partitionIndex
                                  ] * 30
                                }px`,
                                minWidth: "70px",
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
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
                </div>
              ))}
          </Grid>
        </>
      )}

      {seatlayoutpopup === false && open && (
        <>
          <div className=" p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Seat Limit Set
            </h2>

            <h4 className="text-red-500">
              Note : Pls add the same plan name that was used in canvas layout
              creation .
            </h4>

            {plans.map((plan, index) => (
              <div
                key={index}
                className="flex items-center  justify-evenly p-4 rounded-md shadow-sm mb-3"
              >
                <p className="text-md w-1/4 font-medium text-gray-700">
                  {plan.planName}
                </p>

                <input
                  type="number"
                  placeholder="Max Seats"
                  className="border flex justify-start border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2 w-60 text-center"
                  value={plan.maxSeats || ""}
                  onChange={(e) => {
                    const updatedPlans = [...plans];
                    updatedPlans[index].maxSeats = e.target.value;
                    updatedPlans[index].CurrentBookedSeats = 0;
                    setPlans(updatedPlans);
                  }}
                  min={0}
                />
              </div>
            ))}

            <div className="my-10">
              <Button
                variant="contained"
                sx={{ width: "200px", float: "right" }}
                onClick={() => {
                  handleplansubmit();
                }}
              >
                Submit and Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateTickets;
