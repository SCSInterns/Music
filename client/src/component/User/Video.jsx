import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Video() {
  const academyname = sessionStorage.getItem("Academy");
  const [videolink, setvideolink] = useState("");
  const [data, setdata] = useState("");

  function convertToEmbedUrl(youtubeUrl) {
    if (youtubeUrl.includes("youtu.be")) {
      const videoId = youtubeUrl.split("/").pop();
      let url = `https://www.youtube.com/embed/${videoId}`;
      setvideolink(url);
    } else {
      return "Invalid YouTube short link format.";
    }
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      convertToEmbedUrl(data.link);
    }
  }, [data]);

  const getvideolink = async () => {
    const url =
      "https://5817-2401-4900-1c80-3ab2-dca7-daa1-96ff-e659.ngrok-free.app/api/auth/getvideos";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname: academyname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].link) {
          console.log(data);
          setdata(data[0]);
          convertToEmbedUrl(data[0].link);
        }
      } else {
        toast.error("Error fetching video link");
      }
    } catch (error) {
      toast.error("Failed to fetch video link");
    }
  };

  useEffect(() => {
    getvideolink();
  }, [academyname]);

  return (
    <>
      <div style={{ position: "relative", marginBottom: "50px" }}>
        <div
          className="pattern-dots pattern-indigo-900 pattern-bg-white pattern-size-8 pattern-opacity-80"
          style={{
            width: "200px",
            height: "200px",
            position: "absolute",
            top: "-250px",
            left: "10px",
            zIndex: "1",
          }}
        ></div>
      </div>
      <div>
        <h1
          style={{
            color: "#0c4b65",
            lineHeight: "1.8",
            fontSize: "20px",
            fontFamily: "ubuntu",
          }}
        >
          Our Media
        </h1>
      </div>
      <div
        className="flex justify-center items-center p-4"
        style={{ marginTop: "100px", display: "flex", flexDirection: "column" }}
      >
        {videolink && (
          <div className="bg-white overflow-hidden w-full">
            <iframe
              className="h-80"
              style={{
                height: "400px",
                width: "70%",
                zIndex: "10",
                border: "none",
                margin: "auto",
                padding: "20px",
              }}
              src={videolink}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </>
  );
}

export default Video;
