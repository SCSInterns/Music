import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Token from "../../Token/Token";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);
const academyname = sessionStorage.getItem("academyname");
const role = sessionStorage.getItem("role");

function Timetable() {
  const token = Token();

  const [batchData, setBatchData] = useState([]);

  const handleBatches = async () => {
    const url =
      "https://a461-2401-4900-1c80-453-1151-62e6-c991-25b3.ngrok-free.app/api/auth/ngetbatchesdetails";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academyname,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBatchData(data);
      } else {
        toast.error("Error Fetching Batch Details");
      }
    } catch (error) {
      toast.error("Error Fetching Batch Details");
    }
  };

  useEffect(() => {
    if (academyname) {
      handleBatches();
    }
  }, [academyname]);

  const batchColors = {};

  const getBatchColor = (batchName) => {
    if (!batchColors[batchName]) {
      const randomValue = () => Math.floor(Math.random() * 128);
      const r = randomValue();
      const g = randomValue();
      const b = randomValue();
      batchColors[batchName] = `rgb(${r}, ${g}, ${b})`;
    }
    return batchColors[batchName];
  };

  const createEventsFromData = (batches) => {
    console.log(batches);
    const events = [];
    const currentMonthStart = moment().startOf("month");
    const currentMonthEnd = moment().endOf("month");

    batches.forEach((batch) => {
      console.log(batch);
      const batchColor = getBatchColor(batch.batchname);

      batch.schedule.forEach((scheduleItem) => {
        let startDate = currentMonthStart.clone().day(scheduleItem.day);
        if (startDate.isBefore(currentMonthStart)) {
          startDate = startDate.add(1, "week");
        }

        while (startDate.isBefore(currentMonthEnd)) {
          const start = startDate
            .set({
              hour: moment(scheduleItem.starttime, "h:mm A").hour(),
              minute: moment(scheduleItem.starttime, "h:mm A").minute(),
            })
            .toDate();

          const end = startDate
            .set({
              hour: moment(scheduleItem.endtime, "h:mm A").hour(),
              minute: moment(scheduleItem.endtime, "h:mm A").minute(),
            })
            .toDate();

          events.push({
            title: `${batch.batchname} (${scheduleItem.classtype})`,
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
    <div style={{ height: "100vh", padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
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
        style={{ height: "80vh" }}
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
