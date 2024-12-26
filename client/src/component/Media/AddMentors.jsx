import React, { useState } from "react";
import { Divider, TextField, Button, Box, Grid, Chip } from "@mui/material";
import Token from "../Token/Token";
import { toast } from "react-toastify";

function MentorForm() {
  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [mentorExperience, setMentorExperience] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const academyname = sessionStorage.getItem("academyname");
  const role = sessionStorage.getItem("role");
  const token = Token();

  const handleAddCourse = () => {
    if (newCourse.trim() === "") {
      toast.error("Course cannot be empty");
      return;
    }
    if (selectedCourses.length >= 3) {
      toast.error("You can add up to 3 courses only");
      return;
    }
    if (selectedCourses.includes(newCourse)) {
      toast.error("Course already added");
      return;
    }
    setSelectedCourses([...selectedCourses, newCourse]);
    setNewCourse("");
  };

  const handleRemoveCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== course));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(file);
      setImageUrl(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageUrl(null);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      toast.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("picture", profileImage);

    const url =
      "https://music-academy-e32v.onrender.com/api/auth/uploadmentorimage";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      toast.success("Image uploaded successfully");
      setImageUrl(data.imageUrl);
      setProfileImage(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("No profile image selected");
      return;
    }

    if (
      !mentorName ||
      !mentorEmail ||
      !mentorExperience ||
      selectedCourses.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
        "https://music-academy-e32v.onrender.com/api/auth/addmentors",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            academyname: academyname,
            profileimage: imageUrl,
            email: mentorEmail,
            no_of_exp: mentorExperience,
            name: mentorName,
            course: selectedCourses,
          }),
        }
      );

      if (response.ok) {
        toast.success("Mentor added successfully");
        setMentorName("");
        setMentorEmail("");
        setMentorExperience("");
        setSelectedCourses([]);
        setProfileImage(null);
        setImageUrl(null);
      } else {
        toast.error("Failed to add mentor");
      }
    } catch (error) {
      console.error("Error adding mentor:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <h2 style={{ fontWeight: "bold", textAlign: "center" }}>Add Mentor</h2>
      <Divider sx={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ marginTop: "40px" }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div
              style={{
                height: "300px",
                width: "100%",
                maxWidth: "300px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed black",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              {imageUrl ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <p>Click to upload profile image</p>
                </label>
              )}
            </div>
            <Button
              variant="contained"
              onClick={handleImageSubmit}
              disabled={!imageUrl}
              sx={{ marginTop: 2 }}
            >
              Upload
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "& > :not(style)": { m: 1, width: "100%" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Name"
                variant="outlined"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
              />

              <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
              />

              <TextField
                label="Years of Experience"
                type="number"
                variant="outlined"
                value={mentorExperience}
                onChange={(e) => setMentorExperience(e.target.value)}
              />
            </Box>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Course"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                sx={{ marginTop: "15px", marginLeft: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCourse}
                sx={{ mt: 2 }}
              >
                Add Course
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {selectedCourses.length > 0 && (
              <Box>
                {selectedCourses.map((course) => (
                  <Chip
                    key={course}
                    label={course}
                    onDelete={() => handleRemoveCourse(course)}
                    color="primary"
                    sx={{ marginRight: 1, marginBottom: 1 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </div>

      <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
}

export default MentorForm;
