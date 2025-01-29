import React from "react";
import { useState } from "react";
import { TextField, Button, Typography, Grid, Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function BatchManagement() {
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");

  const [formData, setFormData] = useState({
    academyname: academyname,
    role: role,
    batchescount: "",
    studentscount: "",
    classescount: "",
    instrumentperclass: "",
    typeofins: [{ type: "", quantity: "" }],
    duration: "",
    starttime: "",
    endtime: "",
  });

  const [data, setdata] = useState({});
  console.log(formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstrumentChange = (index, e) => {
    const updatedInstruments = [...formData.typeofins];
    updatedInstruments[index][e.target.name] = e.target.value;
    setFormData({ ...formData, typeofins: updatedInstruments });
  };

  const addInstrument = () => {
    setFormData({
      ...formData,
      typeofins: [...formData.typeofins, { type: "", quantity: "" }],
    });
  };

  const removeInstrument = (index) => {
    const updatedInstruments = formData.typeofins.filter((_, i) => i !== index);
    setFormData({ ...formData, typeofins: updatedInstruments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      "https://33c6-2401-4900-1c80-453-a119-e83b-914e-fd0b.ngrok-free.app/api/auth/addbatchesinfo";
    const token = Token();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: formData.academyname,
        role: formData.role,
        batchescount: formData.batchescount,
        studentscount: formData.studentscount,
        classescount: formData.classescount,
        instrumentperclass: formData.instrumentperclass,
        typeofins: formData.typeofins,
        duration: formData.duration,
        startime: formData.starttime,
        endtime: formData.endtime,
      }),
    });

    if (response.ok) {
      await response.json();
      setdata(response);
      setFormData({
        academyname: "",
        role: "",
        batchescount: "",
        studentscount: "",
        classescount: "",
        instrumentperclass: "",
        typeofins: [{ type: "", quantity: "" }],
        duration: "",
        starttime: "",
        endtime: "",
      });
      toast.success("Batch Details Update Successfully ");
    } else {
      toast.error("Error saving batch details ");
    }
  };

  return (
    <>
      <div className="mt-10">
        <p> Step 1 : Enter Basic Details </p>
      </div>

      <div className="mt-5">
        <Box className="p-6 bg-white shadow-md rounded-md max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="No of classes in academy "
                  name="classescount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.classescount}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="No of Batches per class per day "
                  name="batchescount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.batchescount}
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max no of students per batch "
                  name="studentscount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.studentscount}
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Instruments per Class"
                  name="instrumentperclass"
                  type="number"
                  fullWidth
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  value={formData.instrumentperclass}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Types of Instruments</Typography>
                <div className="mt-5">
                  {formData.typeofins.map((instrument, index) => (
                    <Box
                      key={index}
                      className="flex items-center mb-2 space-x-2"
                    >
                      <TextField
                        label="Instrument Type"
                        name="type"
                        variant="outlined"
                        value={instrument.type}
                        onChange={(e) => handleInstrumentChange(index, e)}
                      />
                      <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        variant="outlined"
                        value={instrument.quantity}
                        inputProps={{ min: 0 }}
                        onChange={(e) => handleInstrumentChange(index, e)}
                      />
                      <Button
                        onClick={() => removeInstrument(index)}
                        className="text-red-500"
                      >
                        <Remove />
                      </Button>
                    </Box>
                  ))}
                </div>

                <div className="mt-5 mb-5">
                  <Button
                    onClick={addInstrument}
                    variant="outlined"
                    startIcon={<Add />}
                    className="mt-5"
                  >
                    Add Instrument
                  </Button>
                </div>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Academy Start Time"
                  name="starttime"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.starttime}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Academy End Time"
                  name="endtime"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.endtime}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duration (hours) of batches "
                  name="duration"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.duration}
                  inputProps={{ min: 1 }}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
    </>
  );
}

export default BatchManagement;
