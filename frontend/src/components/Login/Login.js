import "./Login.css";
import background from "../../assets/login-background.png";
import { FaHandSpock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser, setAdmin } from "../../features/auth/authSlice";
import jwt_decode from "jwt-decode";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import config from "../../config";
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [gUser, setGUser] = useState([]);
  const [profile, setProfile] = useState(null);

  // const token = useSelector((state) => (state.auth.token))

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     if (!user.profile_completed) {
  //       navigate("/edit-profile");
  //     } else {
  //       navigate("/match");
  //     }
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`${config.baseUrl}/token/`, {
        email,
        password,
      });
      const token = response.data;
      const user = jwt_decode(token.access);

      if (response.status === 200 && token) {
        dispatch(setToken(token));
        dispatch(setUser(user));
        localStorage.setItem("access", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setAdmin(user.is_admin));

        if (!user.profile_completed) {
          toast.error("Complete your profile");
          navigate("/edit-profile");
        } else {
          if (user.is_admin) {
            navigate("/dashboard/posts");
          } else {
            navigate("/posts");
          }
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
              Accept: "application/json",
            },
          }
        );
        if (res.status === 200) {
          setProfile(res.data);
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const googleAuth = async () => {
    const password = profile.id + "@abc";
    const formData = new FormData();
    formData.append("name", profile.given_name);
    formData.append("email", profile.email);
    formData.append("password", password);
    formData.append("confirm_password", password);

    try {
      const response = await axios.post(
        `${config.baseUrl}/user/google-login/`,
        formData
      );
      if (response.status === 200 || response.status === 201) {
        const response = await axios.post(`${config.baseUrl}/token/`, {
          email: profile.email,
          password: password,
        });
        const token = response.data;
        const user = jwt_decode(token.access);

        if (response.status === 200 && token) {
          dispatch(setToken(token));
          dispatch(setUser(user));
          localStorage.setItem("access", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(user));
          dispatch(setAdmin(user.is_admin));

          if (!user.profile_completed) {
            toast.error("Complete your profile");
            navigate("/edit-profile");
          } else {
            if (user.is_admin) {
              navigate("/dashboard/posts");
            } else {
              navigate("/posts");
            }
          }
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (profile) {
      googleAuth();
    }
  }, [profile]);

  // useEffect(() => {
  //   if (gUser) {
  //     axios
  //       .get(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gUser.access_token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${gUser.access_token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setProfile(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [gUser]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 col-lg-6 col-xl-6 d-none d-md-block d-lg-block d-xl-block mt-5">
          <img className="background" src={background} alt="" />
        </div>
        <div className="col-md-6 col-lg-6 col-xs-6 mx-auto">
          <div className="login-container ">
            <form onSubmit={handleSubmit}>
              {loading && (
                <div className="text-center mb-2">
                  <InfinitySpin width="200" color="#4fa94d" />
                </div>
              )}
              <div className="mb-2">
                <h4 className="text-center">
                  Welcome Back <FaHandSpock />
                </h4>
              </div>
              <div className="mb-4 text-center w-100">
                <div className="d-grid gap-2 ">
                  <button
                    type="button"
                    name=""
                    id=""
                    onClick={googleLogin}
                    className="btn google-login d-flex justify-content-evenly rounded-pill"
                  >
                    <FcGoogle size="1.5em" /> Signin with Google
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name=""
                  id=""
                  className="form-control rounded-pill"
                  placeholder="akhil@gmail.com"
                  aria-describedby="helpId"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
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
