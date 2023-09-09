import { useEffect, useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import config from "../../config";
import { BsFillChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../Chat/Followers.css";

const Followers = () => {
  const [followers, setFollowers] = useState(null);
  const axios = AxiosInstance();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get("/chat/followers/");
      if (response.status === 200) {
        setFollowers(response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chatHandler = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="col-md-3">
      <div className="followers-container">
        <div className="follower-list">
          {followers &&
            followers.length &&
            followers.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-evenly followed-user"
              >
                <img
                  src={`${config.media_url}${item.image}`}
                  width={"80px"}
                  className="follower-image"
                  alt="profile"
                />

                <h3>{item.name}</h3>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Followers;
