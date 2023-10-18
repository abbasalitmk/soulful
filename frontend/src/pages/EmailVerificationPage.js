import React, { useState, useEffect } from "react";
import LogoBar from "../components/Navbar/LogoBar";
import background from "../assets/register-background.png";
import { InfinitySpin } from "react-loader-spinner";
import { ClockLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const EmailVerificationPage = () => {
  const initialTime = 15 * 60; // 30 minutes in seconds
  const [time, setTime] = useState(initialTime);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  let formData = location.state?.formData || null;
  const email = formData?.email;

  // Countdown logic
  useEffect(() => {
    if (!formData) {
      navigate("/register");
    }
    const interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    if (time === 0) {
      navigate("/register");
    }
    return () => clearInterval(interval);
  }, [time]);

  const verifyOTP = async (e) => {
    e.preventDefault(true);

    try {
      setLoading(true);
      const response = await axios.post(`${config.baseUrl}/user/verify-otp/`, {
        otp,
        email,
      });
      if (response.status === 200) {
        try {
          const registerResponse = await axios.post(
            `${config.baseUrl}/user/register/`,
            formData
          );
          if (registerResponse.status === 201) {
            toast.success("User created successfully");
            formData = null;

            navigate("/login");
          }
        } catch (error) {
          if (error.response) {
            toast.error("Something went wrong");
          }
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error("OTP Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <LogoBar />

        <div className="row align-items-center">
          <div className="col-md-6 col-lg-6 col-xl-6 d-none d-md-block d-lg-block d-xl-block mt-5">
            <img className="background" src={background} alt="" />
          </div>
          <div className="col-md-6 col-lg-6 col-xl-6 mx-auto ">
            <div className="login-container align-items-center">
              <form onSubmit={verifyOTP}>
                <div className="mb-2">
                  {loading ? (
                    <div className="text-center">
                      <InfinitySpin width={200} color="#4fa94d" />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-center mb-3">Enter OTP</h3>
                      <div className="text-center mb-2">
                        <p className="d-flex justify-content-evenly">
                          <h4>
                            {Math.floor(time / 60)}:
                            {(time % 60).toString().padStart(2, "0")}
                          </h4>
                          <div>
                            <ClockLoader size={30} color="#36d7b7" />
                          </div>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    type="number"
                    name="otp"
                    value={otp}
                    id="otp"
                    className="form-control rounded-pill"
                    placeholder="Enter OTP"
                    required
                  />
                </div>

                <div className="mb-2 text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
