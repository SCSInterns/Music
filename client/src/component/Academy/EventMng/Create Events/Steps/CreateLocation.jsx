import React from "react";
import { useSelector, useDispatch } from "react-redux";

function CreateLocation() {
  const formData = useSelector((state) => state.event);

  console.log(formData);

  return (
    <>
      <div>CreateLocation</div>
    </>
  );
}

export default CreateLocation;
