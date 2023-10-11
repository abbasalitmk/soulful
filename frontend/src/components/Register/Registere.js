import "./Register.css";
import background from "../../assets/register-background.png";
import { FaHandSpock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import config from "../../config";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirm_password, setConfirmPassword] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const regex = /^[a-zA-Z0-9\s]*$/;

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regex.test(name)) {
      toast.error("Special characters not allowed in name field");
      return;
    }

    const formData = {
      name,
      email,
      password,
      confirm_password,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.baseUrl}/user/register/`,
        formData
      );
      console.log(response.data);
      setLoading(true);
      if (response.status === 201) {
        console.log(response);
        toast.success(response.data.message);

        // dispatch(setToken(response.data.access))
        navigate("/email-verification");
      }
    } catch (error) {
      const errorMessage = error.response.data;
      console.log(errorMessage);

      if (errorMessage) {
        if (errorMessage.email) {
          toast.error("Email :" + errorMessage.email[0]);
        } else if (errorMessage.password) {
          toast.error("password :" + errorMessage.password[0]);
        } else if (errorMessage.name) {
          toast.error("Name :" + errorMessage.name[0]);
        } else if (errorMessage.non_field_errors) {
          toast.error("Error :" + errorMessage.non_field_errors[0]);
        } else {
          toast.error("Something went wrong");
          console.log(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 col-lg-6 col-xl-6 d-none d-md-block d-lg-block d-xl-block mt-5">
          <img className="background" src={background} alt="" />
        </div>
        <div className="col-md-6 col-lg-6 col-xl-6 mx-auto">
          <div className="login-container ">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                {loading ? (
                  <div className="text-center">
                    <InfinitySpin width="200" color="#4fa94d" />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-center">
                      Join us today <FaHandSpock color="#ffce19" />{" "}
                    </h3>
                    <h5 className="text-center">It's Free !</h5>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    name=""
                    id=""
                    className="btn google-login d-flex justify-content-evenly rounded-pill"
                  >
                    <FcGoogle size="1.5em" />
                    Signup with Google
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <label for="" className="form-label">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name=""
                  id=""
                  className="form-control rounded-pill"
                  placeholder="Elon Musk"
                  aria-describedby="helpId"
                />
              </div>
              <div className="mb-2">
                <label for="" className="form-label">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name=""
                  id=""
                  className="form-control rounded-pill"
                  placeholder="elone@gmail.com"
                  aria-describedby="helpId"
                />
              </div>
              <div className="mb-2">
                <label for="" className="form-label">
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control rounded-pill"
                  name=""
                  id=""
                  placeholder="************"
                />
              </div>
              <div className="mb-2">
                <label for="" className="form-label">
                  Confirm Password
                </label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="form-control rounded-pill"
                  name=""
                  id=""
                  placeholder="************"
                />
              </div>
              <div className="mb-2 text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="mb-1">
                <p className="text-center">
                  Have account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
