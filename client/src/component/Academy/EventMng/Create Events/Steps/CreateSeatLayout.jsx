import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import { Armchair } from "lucide-react";
import Token from "../../../../Token/Token";
import { toast } from "react-toastify";

const SeatForm = () => {
  const [formData, setFormData] = useState({
    noofrows: "",
    noofpartition: "",
  });

  const [seatsPerPartition, setSeatsPerPartition] = useState([]);

  const token = Token();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Partition Seats Input
  const handlePartitionSeatsChange = (rowIndex, partitionIndex, value) => {
    const updatedSeats = [...seatsPerPartition];
    if (!updatedSeats[rowIndex]) updatedSeats[rowIndex] = [];
    updatedSeats[rowIndex][partitionIndex] = value;
    setSeatsPerPartition(updatedSeats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    // const url = "http://localhost:5000/api/auth/createseatlayout";

    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `${token}`,
    //   },
    //   body: JSON.stringify({ ...formData, seatsPerPartition }),
    // });

    // if (response.ok) {
    //   toast.success("Seat Layout Created Successfully");
    //   setFormData({ noofrows: "", noofpartition: "" });
    //   setSeatsPerPartition([]);
    // } else {
    //   toast.error("Error Creating Seat Layout");
    // }
  };

  return (
    <Container maxWidth="md" className="my-5">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Rows"
              name="noofrows"
              type="number"
              value={formData.noofrows}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Partitions"
              name="noofpartition"
              type="number"
              value={formData.noofpartition}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ float: "right", bottom: 0 }}
        >
          Submit
        </Button>
      </form>

      {formData.noofrows && formData.noofpartition && (
        <Paper elevation={2} sx={{ marginTop: 3, padding: 2, borderRadius: 2 }}>
          <Typography className="text-sm my-2" align="center" gutterBottom>
            Seat Preview
          </Typography>

          {/* Table Input for Partition-Based Seats */}
          <Grid container spacing={1}>
            <Grid container item spacing={2} alignItems="center">
              <Grid item>
                <Typography className="font-bold">Row No</Typography>
              </Grid>
              {Array.from({ length: Number(formData.noofpartition) }).map(
                (_, partition) => (
                  <Grid item key={partition}>
                    <Typography className="font-bold">
                      Partition {partition + 1}
                    </Typography>
                  </Grid>
                )
              )}
            </Grid>

            {Array.from({ length: Number(formData.noofrows) }).map((_, row) => (
              <Grid container item spacing={2} alignItems="center" key={row}>
                <Grid item>
                  <Typography>{row + 1}</Typography>
                </Grid>
                {Array.from({ length: Number(formData.noofpartition) }).map(
                  (_, partition) => (
                    <Grid item key={partition}>
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
                      />
                    </Grid>
                  )
                )}
              </Grid>
            ))}
          </Grid>

          {/* Seat Preview with Sofa Icon */}
          <Grid container spacing={2} direction="column" sx={{ mt: 3, ml: 4 }}>
            {seatsPerPartition.map((row, rowIndex) => (
              <Grid
                container
                key={rowIndex}
                alignItems="center"
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 5,
                  mt: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Row {rowIndex + 1}
                </Typography>

                {/* Loop over partitions */}
                {row.map((seatCount, partitionIndex) => (
                  <Grid
                    item
                    key={`${rowIndex}-${partitionIndex}`}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    {Array.from({ length: Number(seatCount) }).map((_, i) => (
                      <Tooltip
                        key={`${rowIndex}-${partitionIndex}-${i}`}
                        title={`Row ${rowIndex + 1} - P${
                          partitionIndex + 1
                        } - Seat ${i + 1}`}
                      >
                        <Armchair
                          size={30}
                          style={{
                            color: "#4caf50",
                            cursor: "pointer",
                            margin: "2px",
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default SeatForm;
