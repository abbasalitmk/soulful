import { Fragment, useEffect, useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Please select a gender"),
  place: Yup.string().required("Place is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  preferred_gender: Yup.string().required("Select Preferred gender to connect"),
  interests: Yup.mixed().required(
    "Enter some interests. It's help to find better matchs"
  ),
});

const EditProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const user = JSON.parse(useSelector((state) => state.auth.user));
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user.profile_completed === true) {
      navigate("/posts");
    } else {
      toast.error("User profile not completed");
      navigate("/edit-profile");
    }
  }, []);

  const initialState = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    place: "",
    state: "",
    country: "",
    preferred_gender: "",
    interests: [],
  };
  const [data, setData] = useState({ initialState });
  const [step, setStep] = useState(1);

  const validateForm = async () => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      submitData();
    } catch (errors) {
      errors.errors.forEach((errorMessage) => {
        toast.error(errorMessage);
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 data={data} setData={setData} />;
      case 2:
        return <Step2 data={data} setData={setData} />;
      case 3:
        return <Step3 data={data} setData={setData} />;
      default:
        return null;
    }
  };

  const submitData = async () => {
    console.log(data.interests);
    const formData = new FormData();

    const dob = new Date(data.dob);
    const formated_date = dob.toISOString().split("T")[0];

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("dob", formated_date);
    formData.append("gender", data.gender);
    formData.append("place", data.place);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("prefered_gender", data.preferred_gender);

    if (data.interests.length > 0) {
      formData.append("interests", JSON.stringify(data.interests));
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/edit-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Fragment>
      <Navbar />
      <div className="container step-container mt-5 col-md-8 p-2">
        <div className="row justify-content-center">
          <div className=" col-md-6">
            {renderStep()}

            <div className="button-container d-flex justify-content-between mb-2">
              {step !== 1 && step > 1 ? (
                <button
                  onClick={() => setStep((state) => state - 1)}
                  type="button"
                  class="btn btn-light"
                >
                  Back
                </button>
              ) : null}
              {step !== 3 && (
                <button
                  onClick={() => setStep((state) => state + 1)}
                  type="button"
                  class="btn btn-light"
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  onClick={() => validateForm()}
                  type="button"
                  class="btn btn-success"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default EditProfile;
