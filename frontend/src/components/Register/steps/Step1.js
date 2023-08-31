import { Fragment, useState } from "react";
import "./step.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const Step1 = ({ data, setData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, dob: startDate, [name]: value }));
  };

  return (
    <Fragment>
      <div className="mb-2 mt-2 text-center">
        <h3>Who are you?</h3>
        <h5>Step 1/3</h5>
      </div>

      <div className="mb-2">
        <label for="firstName" className="form-label">
          First Name
        </label>
        <input
          onChange={handleChange}
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          aria-describedby="firstName"
          value={data.firstName}
        />
      </div>
      <div className="mb-2">
        <label for="firstName" className="form-label">
          Last Name
        </label>
        <input
          onChange={handleChange}
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          aria-describedby="lastName"
          value={data.lastName}
        />
      </div>
      <div className="invalid-feedback">{}</div>

      <div className="mb-2">
        <label for="firstName" class="form-label">
          Date of Birth
        </label>
        <div className="mb-2">
          <DatePicker
            className="form-control"
            showIcon
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label for="gender" class="form-label">
          Gender
        </label>
        <div className="mb-3">
          <select
            onChange={handleChange}
            className="form-select"
            name="gender"
            id=""
            value={data.gender}
          >
            <option selected>Select one</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </Fragment>
  );
};

export default Step1;
