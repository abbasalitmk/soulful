import { Fragment, useEffect, useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../AxiosInstance";
import jwt_decode from "jwt-decode";
import { setToken, setUser } from "../../features/auth/authSlice";
import config from "../../config";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Please select a gender"),
  place: Yup.string().required("Place is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),

  skinColor: Yup.string().required("Skin Color is required"),
  hairColor: Yup.string().required("Hair Color is required"),
  height: Yup.number()
    .required("Height is required")
    .positive("Height must be a positive number"),
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be a positive number"),
});

const EditProfile = () => {
  const Axios = AxiosInstance();
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const checkProfileCompleted = async () => {
      try {
        const response = await Axios.get("user/edit-profile/");
        if (response.status === 200) {
          if (!response.data.profile_completed) {
            console.log(response.data.profile_completed);
            toast.error("Your profile not completed");
            navigate("/edit-profile");
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    checkProfileCompleted();
  }, []);

  const initialState = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    place: "",
    state: "",
    country: "",
    skinColor: "",
    hairColor: "",
    height: "",
    weight: "",
  };
  const [data, setData] = useState(initialState);

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

    formData.append("skinColor", data.skinColor);
    formData.append("hairColor", data.hairColor);
    formData.append("height", data.height);
    formData.append("weight", data.weight);

    try {
      const response = await axios.post(
        `${config.baseUrl}/user/edit-profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 200) {
        const userKey = "user";
        const storedUserJSON = localStorage.getItem(userKey);

        if (storedUserJSON) {
          const storedUser = JSON.parse(storedUserJSON);

          storedUser.profile_completed = true;

          localStorage.setItem(userKey, JSON.stringify(storedUser));
        }

        setUser(JSON.parse(localStorage.getItem(user)));

        // try {
        //   const token = await Axios.post("/api/token/refresh/", {
        //     refresh: token.refresh,
        //   });
        //   console.log(token);
        //   if (token.status === 200) {
        //     const user = jwt_decode(token.access);
        //     setUserData(user);
        //     const tokenData = token.data;
        //     dispatch(setToken(tokenData));
        //     dispatch(setUser(user));
        //     localStorage.setItem("access", JSON.stringify(tokenData));
        //     localStorage.setItem("user", JSON.stringify(user));

        //     console.log("refresh", token);
        //   }
        // } catch (error) {
        //   console.log(error.response);
        // }

        navigate("/profile");
        toast.success("Profile updated!");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
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
    </>
  );
};
export default EditProfile;
