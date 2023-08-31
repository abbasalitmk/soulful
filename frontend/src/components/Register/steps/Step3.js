import { Fragment, useState } from "react";
import "./step.css";

const Step3 = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "interests") {
      const interestsArray = value.split(",").map((item) => item.trim());

      setData((prevData) => ({ ...prevData, interests: interestsArray }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Fragment>
      <div className="mb-2 mt-2 text-center">
        <h3>What's your Interests?</h3>
        <h5>Step 3/3</h5>
      </div>
      <div className="mb-3">
        <label for="firstName" className="form-label">
          I want to date..
        </label>
        <div className="mb-3">
          <select
            onChange={handleChange}
            className="form-select"
            name="preferred_gender"
            id=""
            value={data.preferred_gender}
          >
            <option selected>Select one</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label for="firstName" className="form-label">
          My Interests
        </label>
        <textarea
          onChange={handleChange}
          name="interests"
          className="form-control mb-4 active"
          id="exampleFormControlTextarea1"
          rows="4"
          value={data.interests}
          placeholder="add comma(,) seperated values."
        ></textarea>
      </div>
    </Fragment>
  );
};

export default Step3;
