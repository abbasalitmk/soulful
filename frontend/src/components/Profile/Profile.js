import Navbar from "../Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import avatar from "../../assets/avatar.jpeg";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../Profile/Profile.css";
import config from "../../config";
import toast from "react-hot-toast";
import { FallingLines } from "react-loader-spinner";

import {
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRegEdit,
  FaTasks,
} from "react-icons/fa";
import { FcCamera } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/user/profile/", {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!user.profile_completed) {
    //   toast.error("Your profile not completed");
    //   navigate("/edit-profile");
    // }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  // image upload handler
  const imageUploadHandler = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/user/profile-picture/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Profile picture uploaded successfully");
          fetchData();
        }
      } catch (error) {
        console.log(error.response);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Select image!");
    }
  };
  return (
    <>
      <div className="col-md-9 offset-md-3">
        <div className="profile-container mt-5">
          <div className="row">
            {loading ? (
              <div>
                <FallingLines
                  color="#4fa94d"
                  width="100"
                  visible={true}
                  ariaLabel="falling-lines-loading"
                />
                <p>Loading posts...</p>
              </div>
            ) : (
              <div className="col-md-3">
                {userData && userData.profile_pictures && (
                  <img
                    className="profile-avatar img-thumbnail"
                    src={
                      userData.profile_pictures &&
                      userData.profile_pictures.length > 0
                        ? config.media_url + userData.profile_pictures[0].image
                        : avatar
                    }
                    alt=""
                  />
                )}
                <div className="mb-3  text-center">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/"
                    id="file"
                    name="image"
                    onChange={imageUploadHandler}
                    style={{ display: "none" }}
                    loading="lazy"
                  />
                  <label for="file">
                    <li className="me-2 btn btn-warning">
                      <FcCamera size={"2em"} />
                      Change Picture
                    </li>
                  </label>
                </div>
              </div>
            )}
            <div className="col-md-5 profile-details">
              {userData && userData.user_profile && (
                <>
                  <h2>
                    {userData.user_profile.first_name +
                      " " +
                      userData.user_profile.last_name}{" "}
                    <button className="btn">
                      <FaRegEdit size={"2em"} className="text-danger" />
                    </button>
                  </h2>
                  <p>
                    <FaUserFriends className="me-3 text-danger" />
                    {userData.user_profile.gender}
                  </p>
                  <p>
                    <FaBirthdayCake className="me-3 text-danger" />
                    {userData.user_profile.dob}
                  </p>
                  <p className="text-secondary">
                    <FaMapMarkerAlt className="me-3 text-danger" />
                    Location
                  </p>

                  <p>
                    {userData.user_profile.place}, {userData.user_profile.state}
                  </p>
                  <p>
                    <FaTasks className="me-3 text-danger" />
                    Hair : {userData.user_profile.hairColor}
                  </p>
                  <p>
                    <FaTasks className="me-3 text-danger" />
                    Skin: {userData.user_profile.skinColor}
                  </p>
                </>
              )}
            </div>
            {userData && userData.profile_pictures && (
              <div className="col-md-4 ">
                <h5>Gallary</h5>

                <div className="row">
                  {userData.profile_pictures.map((item, index) => {
                    if (index === 0) {
                      return null;
                    } else {
                      return (
                        <div className="col-md-6">
                          <img
                            className="small-image img-thumbnail"
                            src={config.media_url + item.image}
                            alt=""
                            key={item.id}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
