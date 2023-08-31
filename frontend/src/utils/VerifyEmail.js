import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
// import { toast } from 'react-toastify';

import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";

const VerifyEmail = (props) => {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const user = JSON.parse(useSelector((state) => state.auth.user)) || null;

  const verify = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user/verify-email/?token=${token}`
      );
      if (response === 200) {
        toast.success("verified");
        setVerified(true);

        if (user.profile_completed) {
          navigate("/`posts`");
        } else {
          navigate("/edit-profile");
        }
      }
    } catch (error) {
      if (error) {
        if (error.response.data.error === "user already verified") {
          // toast.error(error.response.data.error);
          navigate("/login");
        }
      }
    }
  };

  useEffect(() => {
    verify();
  }, [token]);

  return (
    <div>
      <div className="container">
        {verified ? (
          <div className="d-flex justify-content-center align-items-center pt-5 mt-5">
            <div className="text-center">
              <h1>Successfully Verified</h1>
              <h4>click to login</h4>
              <button className="btn btn-primary">Login</button>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center pt-5 mt-5">
            <div className="text-center">
              <h1>Your are not verified</h1>
              <h4>Check your mail for verification link</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifyEmail;
