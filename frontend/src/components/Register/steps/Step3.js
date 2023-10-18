import React, { Fragment } from "react";
import "./step.css";

const Step3 = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Create a copy of the current data state
    const updatedData = { ...data };

    // Update the copy with the new value
    updatedData[name] = value;

    // Set the updated data state
    setData(updatedData);
  };

  return (
    <Fragment>
      <div className="mb-2 mt-2 text-center">
        <h4>Complete your profile</h4>
        <h5>Step 3/3</h5>
      </div>
      <div className="mb-3">
        <label htmlFor="skin-color" className="form-label">
          Skin Color
        </label>
        <div className="mb-3">
          <select
            onChange={handleChange}
            className="form-select"
            name="skinColor"
            id="skin-color"
            value={data.skinColor}
          >
            <option>Skin Color</option>
            <option value="Fair">Fair</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="hair-color" className="form-label">
          Hair Color
        </label>
        <div className="mb-3">
          <select
            onChange={handleChange}
            className="form-select "
            name="hairColor"
            id="hair-color"
            value={data.hairColor}
          >
            <option>Hair Color</option>
            <option value="Black">Black</option>
            <option value="Brown">Brown</option>
            <option value="Blonde">Blonde</option>
            {/* Add more hair color options here */}
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="bio">Bio</label>
        <textarea
          className="form-control"
          id="bio"
          name="bio"
          placeholder="About me"
          required
          onChange={handleChange}
          value={data.bio}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="status">Relationship Status</label>
        <select
          onChange={handleChange}
          className="form-select "
          name="status"
          id="status"
          value={data.status}
        >
          <option>Select Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </select>
      </div>
    </Fragment>
  );
};

export default Step3;
