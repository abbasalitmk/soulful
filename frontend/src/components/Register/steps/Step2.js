import { Fragment, useState } from "react";
import "./step.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Step2 = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Fragment>
      <div className="mb-2 mt-2 text-center">
        <h4>Complete your profile</h4>
        <h5>Step 2/3</h5>
      </div>
      <div class="mb-2">
        <label for="place" class="form-label">
          Place
        </label>
        <input
          onChange={handleChange}
          type="text"
          class="form-control"
          id="place"
          name="place"
          aria-describedby="place"
          value={data.place}
        />
      </div>
      <div class="mb-2">
        <label for="state" class="form-label">
          State
        </label>
        <input
          onChange={handleChange}
          type="text"
          class="form-control"
          id="state"
          name="state"
          aria-describedby="lastName"
          value={data.state}
        />
      </div>

      <div class="mb-3">
        <label for="country" class="form-label">
          Country
        </label>
        <input
          onChange={handleChange}
          type="text"
          class="form-control"
          id="country"
          name="country"
          aria-describedby="country"
          value={data.country}
        />
      </div>
    </Fragment>
  );
};

export default Step2;
