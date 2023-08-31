import { useSelector } from "react-redux";
import pic from "../../assets/avatar.jpeg";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Match.css";
import { BsHeartFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";

const Match = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    fetchData();
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

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
                  <div className="col-md-3">
                    <div className="image-container">
                      <p className="person-name">{item?.name}</p>
                      <p className="person-location">{item?.location}</p>
                      <img
                        src={item.image ? config.baseUrl + item?.image : pic}
                        alt=""
                      />
                      <button className="follow-button">
                        <BsHeartFill size={"1.1em"} />
                      </button>
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
