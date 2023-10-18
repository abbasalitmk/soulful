import { Fragment, useState } from "react";
import ForgotImage from "../../assets/forgot.png";
import AxiosInstance from "../../AxiosInstance";
import axios from "axios";
import "./ForgotPassword.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import config from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState(null);
  const [otp, setOTP] = useState(null);
  const [showOPTInput, setShowOTPInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async () => {
    setError(null);
    try {
      setLoading(true);
      const response = await axios.post(
        `${config.baseUrl}/user/reset-password/`,
        {
          email: email,
        }
      );
      if (response.status === 200) {
        setShowOTPInput(true);
      }
    } catch (error) {
      if (error) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError(null);
    try {
      setLoading(true);
      const response = await axios.post(`${config.baseUrl}/user/verify-otp/`, {
        otp: otp,
        email: email,
      });
      if (response.status === 200) {
        setShowPasswordInput(true);
        setShowOTPInput(false);
      }
    } catch (error) {
      if (error) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.baseUrl}/user/reset-password/`,
        {
          email: email,
          password: password,
          confirm_password: confirmPassword,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <img src={ForgotImage} alt="forgot password" width={"100%"} />
          </div>
          <div className="col-md-6 p-5">
            <h3 className="mb-3">Reset Password</h3>
            {error && <p className="mt-3 text-danger">{error}</p>}

            {loading && (
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            )}

            <div
              className={`input-group input-group-lg mb-3 ${
                showOPTInput | showPasswordInput ? "d-none" : "d-show"
              }`}
            >
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter your email"
              />

              <button
                onClick={resetPasswordHandler}
                className="btn btn-success"
                id="inputGroup-sizing-lg"
              >
                Submit
              </button>
            </div>
            <div
              className={`input-group input-group-lg ${
                showOPTInput ? "d-show" : "d-none"
              }`}
            >
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter OTP"
              />

              <button
                onClick={verifyOTP}
                className="btn btn-danger"
                id="inputGroup-sizing-lg"
              >
                Submit
              </button>
            </div>
            <div className={showPasswordInput ? "d-show" : "d-none"}>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  name=""
                  id=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  name=""
                  id=""
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=""
                />
              </div>
              <button
                onClick={changePassword}
                className="btn btn-danger"
                id="inputGroup-sizing-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
