import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Token from "../Token/Token";

const ApplicantsTable = ({ users }) => {
  const [data, setData] = useState();
  const [toggle, setToggle] = useState(false);

  const hasUsers = users && users.length > 0;



  const handlePreview = async (id) => {
    const url = `http://localhost:5000/api/auth/getdatabyid/${id}`;
    let token = Token();
    let role = sessionStorage.getItem("role");

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        toast.success("Details Fetch Success");
        setToggle(true);
      } else {
        toast.error("Error fetching info");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleClose = () => {
    setToggle(false);
    setData(null);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: "70%", margin: "auto", marginTop: "50px" }}
      >
        {hasUsers ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>More Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.additionalFields.formdata?.Name}</TableCell>
                  <TableCell>{user.additionalFields.formdata?.Email}</TableCell>
                  <TableCell>
                    {user.additionalFields.formdata?.MobileNo}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handlePreview(user._id)}>
                      <PreviewIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </TableContainer>

      {/* Preview Modal */}
      <Dialog
        open={toggle}
        onClose={handleClose}
        aria-labelledby="preview-dialog-title"
        aria-describedby="preview-dialog-description"
        maxWidth="md"
        sx={{ 
          '& .MuiDialog-paper': { 
            width: '600px',   
            height: '400px'  
          } , 
          margin:'auto'
        }}
      >
        <DialogTitle id="preview-dialog-title">Detailed Information</DialogTitle>
        <DialogContent>
          <DialogContentText id="preview-dialog-description">
            {data ? (
              <>
                <Typography>
                  Name : {data.additionalFields.formdata?.Name}
                </Typography>
                <Typography>
                  Email : {data.additionalFields.formdata?.Email}
                </Typography>
                <Typography>
                  Mobile No : {data.additionalFields.formdata?.MobileNo}
                </Typography>
                <Typography>
                  Course : {data.additionalFields.formdata?.Courses}
                </Typography>
                <Typography>Fees : {data.additionalFields.fees}</Typography>
                <Typography>
                  Age : {data.additionalFields.formdata?.Age}
                </Typography>
                <Typography>
                  Gender : {data.additionalFields.formdata?.Gender}
                </Typography>
              </>
            ) : (
              <Typography>No information available.</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicantsTable;
