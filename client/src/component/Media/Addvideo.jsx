import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography ,Button} from "@mui/material";
import { useState } from "react";

export default function Addvideo() {  

const [videolink, setvideolink] = useState("")


const handlesubmit = async () => 
{
    const url = "http://localhost:5000/api/auth/uploadvideo";
   

}

  return (
     <>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 1, width: "100ch" }, marginTop: "100px" }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="link" variant="outlined" onChange={ (e) => setvideolink(e.target.value)} />
      </Box>
      <Typography sx={{ color: "#283255", marginTop: "20px" }}>
        {" "}
        Please insert youtube video link above{" "}
      </Typography> 
    </div>
      <Button variant="contained" sx={{float:'right' , marginRight: '20px'}} onClick={() => {handlesubmit()}}>
         Upload     
      </Button> 
      </>
  );
}
