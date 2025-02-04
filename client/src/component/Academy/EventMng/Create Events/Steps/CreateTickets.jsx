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
} from "@mui/material";
import { Armchair } from "lucide-react";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import { Plus } from "lucide-react";

function CreateTickets() {
  const [formdata, setformdata] = useState([]);
  const [open, setopen] = useState(false);
  const [plans, setPlans] = useState([{ planName: "", pricePerSeat: "" }]);

  const getlayout = async () => {
    const url = "http://localhost:5000/api/auth/getseatlayout";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Token()}`,
      },
      body: JSON.stringify({
        eventid: "123",
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

  console.log(plans);

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
                  <Grid container spacing={1} ml={2}>
                    <Grid container item spacing={2} alignItems="center">
                      <Grid item sx={{ width: "80px" }}>
                        <p>Row</p>
                      </Grid>
                      {Array.from({
                        length: Number(formdata.noofpartition),
                      }).map((_, partition) => (
                        <Grid
                          item
                          key={partition}
                          sx={{ textAlign: "center", flex: "1 1 0" }}
                        >
                          <Typography className="font-bold">
                            Partition {partition + 1}
                          </Typography>
                        </Grid>
                      ))}

                      <Grid item sx={{ textAlign: "center", width: "120px" }}>
                        <Typography className="font-bold">Plan</Typography>
                      </Grid>
                    </Grid>

                    {Array.from({ length: Number(formdata.noofrows) }).map(
                      (_, row) => (
                        <Grid
                          container
                          item
                          spacing={2}
                          alignItems="center"
                          key={row}
                        >
                          <Grid
                            item
                            sx={{ width: "80px", textAlign: "center" }}
                          >
                            <Typography>{row + 1}</Typography>
                          </Grid>

                          {Array.from({
                            length: Number(formdata.noofpartition),
                          }).map((_, partition) => (
                            <Grid
                              item
                              key={partition}
                              sx={{
                                textAlign: "center",
                                flex: "1 1 0",
                                marginY: 2,
                              }}
                            >
                              <TextField
                                type="number"
                                size="small"
                                value={
                                  formdata.seatsPerPartition[row]?.[
                                    partition
                                  ] || ""
                                }
                                inputProps={{ min: 0, readOnly: true }}
                                sx={{ width: "30%" }}
                              />
                            </Grid>
                          ))}

                          <Grid
                            item
                            sx={{
                              textAlign: "center",
                              width: "120px",
                            }}
                          >
                            <FormControl fullWidth>
                              <InputLabel id="venue-label">
                                Select Plan
                              </InputLabel>
                              <Select
                                value={
                                  formdata.plansPerRow[row]?.planName || ""
                                }
                                onChange={(e) => {
                                  const selectedPlan = plans.find(
                                    (plan) => plan.planName === e.target.value
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
                          </Grid>
                        </Grid>
                      )
                    )}
                  </Grid>
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
    </div>
  );
}

export default CreateTickets;
