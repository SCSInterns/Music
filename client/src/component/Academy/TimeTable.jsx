import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Token from "../Token/Token";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);
const academyname = sessionStorage.getItem("academyname");
const role = sessionStorage.getItem("role");

function Timetable() {
  const [batchData, setBatchData] = useState([]);

  const handlebatches = async () => {
    const token = Token();
    const url = "http://localhost:5000/api/auth/getbatchesdetails";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academyname: academyname,
        role: role,
      }),
    });

    if (response.ok) {
      const details = await response.json();
      console.log(details);
      setBatchData(details);
    } else {
      toast.error("Error fetching batch details");
    }
  };

  useEffect(() => {
    handlebatches();
  }, [academyname]);
  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128);
    const r = randomValue();
    const g = randomValue();
    const b = randomValue();

    return `rgb(${r}, ${g}, ${b})`;
  };

  const createEventsFromData = (batches) => {
    const events = [];
    const currentMonthStart = moment().startOf("month");
    const currentMonthEnd = moment().endOf("month");

    batches.forEach((batch) => {
      const batchColor = getRandomColor();

      batch.days.forEach((day) => {
        let startDate = currentMonthStart.clone().day(day);
        if (startDate.isBefore(currentMonthStart)) {
          startDate = startDate.add(1, "week");
        }

        while (startDate.isBefore(currentMonthEnd)) {
          const start = startDate
            .set({
              hour: moment(batch.starttime, "HH:mm").hour(),
              minute: moment(batch.starttime, "HH:mm").minute(),
            })
            .toDate();

          const end = startDate
            .set({
              hour: moment(batch.endtime, "HH:mm").hour(),
              minute: moment(batch.endtime, "HH:mm").minute(),
            })
            .toDate();

          events.push({
            title: `${batch.batchname} (${batch.batchtype})`,
            start,
            end,
            allDay: false,
            color: batchColor,
          });

          startDate.add(1, "week");
        }
      });
    });

    return events;
  };

  const events = createEventsFromData(batchData);

  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "50px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Monthly Timetable
      </h2>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="month"
        views={["month", "week", "day"]}
        step={60}
        timeslots={1}
        defaultDate={new Date()}
        style={{ height: "100vh" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            color: "white",
            borderRadius: "5px",
            padding: "5px",
            border: "none",
          },
        })}
      />
    </div>
  );
}

export default Timetable;
