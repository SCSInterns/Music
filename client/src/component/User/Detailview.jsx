import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Detailview() {
  const [detailview, setdetailview] = useState({});
  const academyname = sessionStorage.getItem("Academy");
  const { id } = useParams();
  const eventId = id;

  const knowmoredetails = async (eventId) => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/knowmoredetails";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        id: eventId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setdetailview(data[0]);
    } else {
      toast.error("Error fetching detail view ");
    }
  };

  useEffect(() => {
    knowmoredetails(eventId);
  }, [eventId]);

  console.log(detailview);

  return (
    <>
      <Navbar />
      <div style={{ position: "relative", marginTop: "30px" }}>
        <h1
          style={{ fontFamily: "ubuntu", color: "#0c4b65", fontSize: "18px" }}
        >
          {detailview.eventname}
        </h1>

        <div style={{ position: "relative" }}>
          <div
            className="pattern-dots pattern-indigo-900 pattern-bg-white pattern-size-8 pattern-opacity-80"
            style={{
              width: "200px",
              height: "200px",
              position: "absolute",
              top: "100px",
              left: "20px",
              zIndex: "0",
            }}
          ></div>

          <div
            style={{
              backgroundImage: `url(${detailview.imageUrl})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "400px",
              width: "100%",
              marginTop: "20px",
              position: "relative",
              zIndex: "100",
            }}
          ></div>
        </div>

        <div>
          <div>
            <p
              style={{
                fontFamily: "ubuntu",
                color: "#0c4b65",
                fontSize: "16px",
                float: "left",
                marginLeft: "20px",
                marginTop: "40px",
              }}
            >
              Description:{" "}
            </p>
          </div>
          <div style={{ display: "inline-block" }}>
            <p
              style={{
                marginTop: "30px",
                fontSize: "16px",
                textAlign: "justify",
                marginLeft: "20px",
                marginTop: "40px",
                margin: "50px",
              }}
            >
              {detailview.description}
            </p>
          </div>

          <h1
            style={{
              fontFamily: "ubuntu",
              color: "#0c4b65",
              fontSize: "16px",
              float: "left",
              marginLeft: "20px",
              marginTop: "40px",
            }}
          >
            Event Details :
          </h1>

          <div
            style={{
              marginLeft: "20px",
              marginTop: "80px",
              marginBottom: "100px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <p
              style={{
                fontFamily: "ubuntu",
                fontSize: "16px",
                color: "#0c4b65",
              }}
            >
              <strong>Date:</strong> {detailview.date}
            </p>
            <p
              style={{
                fontFamily: "ubuntu",
                fontSize: "16px",
                color: "#0c4b65",
              }}
            >
              <strong>Time:</strong> {detailview.time}
            </p>
            <p
              style={{
                fontFamily: "ubuntu",
                fontSize: "16px",
                color: "#0c4b65",
              }}
            >
              <strong>Location:</strong> {detailview.location}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detailview;
