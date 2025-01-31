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
} from "@mui/material";
import { Armchair } from "lucide-react";
import Token from "../../../../Token/Token";

const SeatForm = () => {
  const [formData, setFormData] = useState({
    noofrows: "",
    noofpartition: "",
  });

  const [seatsPerPartition, setSeatsPerPartition] = useState([]);
  const [maxSeatsPerPartition, setMaxSeatsPerPartition] = useState([]);
  const [order, setorder] = useState("Ascending");
  const token = Token();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePartitionSeatsChange = (rowIndex, partitionIndex, value) => {
    const updatedSeats = [...seatsPerPartition];
    if (!updatedSeats[rowIndex]) updatedSeats[rowIndex] = [];
    updatedSeats[rowIndex][partitionIndex] = value;
    setSeatsPerPartition(updatedSeats);
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
    const url = "http://localhost:5000/api/auth/createseatlayout";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: {
        academyid: sessionStorage.getItem("academyid"),
        noofrows: formData.noofrows,
        noofpartition: formData.noofpartition,
        seatsPerPartition: seatsPerPartition,
        maxSeatsPerPartition: maxSeatsPerPartition,
        seatingorientation: order,
        eventid: "123",
        planname: "Default",
        priceperseat: 100,
      },
    });
  };

  return (
    <Container maxWidth="md" className="my-5">
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

                    {Array.from({ length: Number(formData.noofpartition) }).map(
                      (_, partition) => (
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
                      )
                    )}
                  </Grid>
                )
              )}
            </Grid>
          </div>

          {/* Seat Layout Preview */}
          <Grid container spacing={2} direction="column" sx={{ mt: 3, ml: 4 }}>
            <div className="flex justify-center">
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
                        width: `${maxSeatsPerPartition[partitionIndex] * 30}px`,
                        minWidth: "70px",
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        // justifyContent:
                        //   partitionIndex % 2 !== 0 ? "center" : "center",
                        justifyContent:
                          partitionIndex % 2 !== 0 ? "flex-start" : "flex-end",
                      }}
                    >
                      {Array.from({ length: Number(seatCount) }).map((_, i) => (
                        <Tooltip
                          key={`${rowIndex}-${partitionIndex}-${i}`}
                          title={`${String.fromCharCode(rowIndex + 65)}- P${
                            partitionIndex + 1
                          } - Seat ${i + 1}`}
                        >
                          <Armchair
                            style={{
                              color: "#4caf50",
                              cursor: "pointer",
                              margin: "2px",
                              width: "18px",
                              height: "18px",
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default SeatForm;
