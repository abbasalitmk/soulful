import { useSelector } from "react-redux";
import pic from "../../assets/avatar.jpeg";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Match.css";
import { BsHeartFill, BsFillHeartbreakFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Match = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/user/all-users/",
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.profile_completed) {
      toast.error("Your profile not completed");
      navigate("/edit-profile");
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const userFollowingHandler = async (user_id) => {
    try {
      console.log(token.access);
      const response = await axios.post(
        `http://127.0.0.1:8000/user/follow/${user_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Your are Followed");
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

  return (
    <>
      <Navbar />

      <div className="container">
        <Sidebar />
        <div className="col-md-9 offset-md-3 p-4">
          <div className="row">
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
                      />
                      {item?.follow ? (
                        <>
                          <button
                            onClick={() => userFollowingHandler(item.id)}
                            className="follow-button if_followed"
                          >
                            <BsFillHeartbreakFill size={"1.3em"} />
                          </button>
                        </>
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
