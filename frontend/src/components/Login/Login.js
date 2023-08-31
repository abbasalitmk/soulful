import "./Login.css";
import background from "../../assets/login-background.png";
import { FaHandSpock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../../features/auth/authSlice";
import jwt_decode from "jwt-decode";
import toast from "react-hot-toast";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  // const token = useSelector((state) => (state.auth.token))

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/posts");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });
      const token = response.data;
      const user = jwt_decode(token.access);

      if (response.status === 200 && token) {
        if (!user.is_verified) {
          toast.error("user is not verified");

          navigate("/email-verification");
        } else {
          dispatch(setToken(token));
          dispatch(setUser(user));
          localStorage.setItem("access", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(user));
          if (user.profile_completed) {
            navigate("/posts");
          } else {
            toast.error("Complete your profile to continue");
            navigate("/edit-profile");
          }
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 col-sm-12 col-xs-12">
          <img className="background" src={background} alt="" />
        </div>
        <div className="col-md-6 col-sm-12 col-xs-12 mx-auto">
          <div className="login-container ">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <h4 className="text-center">
                  Welcome Back <FaHandSpock />
                </h4>
              </div>
              <div className="mb-4">
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    name=""
                    id=""
                    className="btn google-login d-flex justify-content-evenly rounded-pill"
                  >
                    <FcGoogle size="1.5em" />
                    Signin with Google
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label for="" className="form-label">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name=""
                  id=""
                  className="form-control rounded-pill"
                  placeholder="johndoe@gmail.com"
                  aria-describedby="helpId"
                />
              </div>
              <div className="mb-3">
                <label for="" className="form-label">
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="form-control rounded-pill"
                  name=""
                  id=""
                  placeholder="*********"
                />
              </div>
              <div className="mb-2 text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>

              <div className="mb-1 text-center">
                <p className="text-center">
                  Don't have account? <Link to="/register">Register</Link>
                </p>
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  Forgot Password
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
