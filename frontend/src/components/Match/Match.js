import { useSelector } from "react-redux";
import pic from "../../assets/avatar.jpeg";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Match.css";
import { BsHeartFill, BsFillHeartbreakFill, BsMessenger } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../../config";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../AxiosInstance";
import WebsocketContext from "../../context/WebsocketContext";

const Match = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const Axios = AxiosInstance();
  const [search, setSearch] = useState("");
  const { notification } = useContext(WebsocketContext);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.baseUrl}/user/all-users/`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      if (response.status === 200) {
        setUserData(response.data);
        toast.success("rendering");
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [notification]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    try {
      const response = await Axios.get(`user/all-users?query=${search}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const userFollowingHandler = async (user_id) => {
    try {
      console.log(token.access);
      const response = await axios.post(
        `${config.baseUrl}/match/follow-request/${user_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Friend Request sent");
        console.log(response.data);
        fetchData();
      } else if (response.status === 202) {
        toast.success("Your are Unfollowed");
        fetchData();
      } else {
        toast.error("Something Happened");
      }

      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const showProfile = (user_id) => {
    navigate("/profile", { state: { user_id } });
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <Sidebar />

        <div className="col-md-9 offset-md-3 p-4">
          <div className="row">
            <div className="search-bar mb-4">
              <div class="input-group w-50 mx-auto">
                <input
                  type="text"
                  class="form-control"
                  value={search}
                  onChange={handleSearch}
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
            {userData && userData.length > 0 ? (
              userData?.map((item) => {
                return (
                  <div className="col-md-3 mb-3">
                    <div className="image-container">
                      <p className="person-name">{item?.name}</p>
                      <p className="person-location">{item?.location}</p>
                      <img
                        src={item.image ? config.media_url + item?.image : pic}
                        alt=""
                        onClick={() => showProfile(item?.id)}
                      />
                      {item?.request_pending ? (
                        <>
                          <button className="btn btn-warning requested_button">
                            Request Sent
                          </button>
                          {/* <button
                            onClick={() => userFollowingHandler(item.id)}
                            className="follow-button if_followed"
                          >
                            <BsFillHeartbreakFill size={"1.3em"} />
                          </button> */}
                        </>
                      ) : item?.request_accepted ? (
                        <Link to="/meet">
                          <button className="follow-button if_followed">
                            <BsMessenger size={"1.4em"} />
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={() => userFollowingHandler(item.id)}
                          className="follow-button if_not_followed"
                        >
                          <BsHeartFill size={"1.3em"} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Match;
