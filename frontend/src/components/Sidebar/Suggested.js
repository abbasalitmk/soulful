import { useSelector } from "react-redux";
import pic from "../../assets/avatar.jpeg";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Suggested.css";
import { BsHeartFill, BsFillHeartbreakFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Suggested = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

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
    console.log(userData);
  }, [userData]);

  return (
    <div className="suggested-scroll-container d-none d-lg-block d-xl-block">
      <div className="col-md-12">
        <div className="row m-3">
          <h5 className="mt-3">Suggested Matches</h5>

          <div className="suggested-matches">
            {userData && userData.length > 0 ? (
              userData?.map((item) => {
                return (
                  <div className="col-md-3 mb-3">
                    <div className="suggested-image-container">
                      <p className="person-name">{item?.name}</p>
                      <p className="person-location">{item?.location}</p>
                      <img
                        src={item.image ? config.media_url + item?.image : pic}
                        alt=""
                      />
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
    </div>
  );
};

export default Suggested;
