import React, { useState, useEffect } from "react";

function QRCodeComponent({ qrcode }) {
  console.log(" QR CODE : ", qrcode);
  return (
    <>
      <div style={{ display : 'flex' , alignItems : 'center' , justifyContent : 'center'}}>
        {qrcode && <img src={qrcode} width={300} height={300} alt="QR Code" />}
      </div>
      
    </>
  );
}

export default QRCodeComponent;
