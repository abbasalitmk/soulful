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
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";

import {
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRegEdit,
  FaTasks,
  FaRegCommentDots,
  FaVenusMars,
} from "react-icons/fa";
import { FcCamera } from "react-icons/fc";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Suggested from "../Sidebar/Suggested";
import AxiosInstance from "../../AxiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = user.user_id;
  const { state } = location;
  const user_id = state?.user_id || currentUserId;
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  // yup validation schema

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(3, "First Name must be at least 3 characters")
      .matches(/^[a-zA-Z\s]*$/, "Only letters and spaces are allowed"),
    last_name: Yup.string().matches(
      /^[a-zA-Z\s]*$/,
      "Only letters and spaces are allowed"
    ),
    dob: Yup.date(),
    gender: Yup.string(),
    place: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),

    skinColor: Yup.string(),
    hairColor: Yup.string(),

    status: Yup.string(),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate(editedData, { abortEarly: false });
      profileUpdateHandler();
    } catch (errors) {
      errors.errors.forEach((errorMessage) => {
        toast.error(errorMessage);
      });
    }
  };

  const Axios = AxiosInstance();

  useEffect(() => {
    fetchData(user_id);
  }, [location, currentUserId]);

  const fetchData = async (user_id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.baseUrl}/user/profile/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 200) {
        setUserData(response.data);
        setEditedData(response.data.user_profile);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkProfileCompleted = async () => {
      try {
        const response = await Axios.get("user/edit-profile/");
        if (response.status === 200) {
          if (!response.data.profile_completed) {
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

  // image upload handler
  const imageUploadHandler = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (!/(\.jpg|\.png |\.jpeg)$/i.test(selectedImage.name)) {
        toast.error("Please select a valid image file (jpg or png).");
      } else {
        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
          setLoading(true);
          const response = await axios.post(
            `${config.baseUrl}/user/profile-picture/`,
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
            fetchData(user_id);
          }
        } catch (error) {
          console.log(error.response);
        } finally {
          setLoading(false);
        }
      }
    } else {
      toast.error("Select image!");
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const profileUpdateHandler = async () => {
    const formData = new FormData();

    const dob = new Date(editedData.dob);
    const formated_date = dob.toISOString().split("T")[0];

    formData.append("firstName", editedData.first_name);
    formData.append("lastName", editedData.last_name);
    formData.append("dob", formated_date);
    formData.append("gender", editedData.gender);
    formData.append("place", editedData.place);
    formData.append("state", editedData.state);
    formData.append("country", editedData.country);

    formData.append("skinColor", editedData.skinColor);
    formData.append("hairColor", editedData.hairColor);
    formData.append("bio", editedData.bio);
    formData.append("status", editedData.status);

    try {
      const response = await Axios.patch(
        `${config.baseUrl}/user/update-profile/`,
        formData
      );
      if (response.status === 200) {
        toast.success("Profile updated!");
        setShowModal(false);
        navigate("/profile");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      dob: startDate,
      [name]: value,
    }));
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

                {user_id === currentUserId && (
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
                    <label htmlFor="file">
                      <li className="me-2 btn btn-warning">
                        <FcCamera size={"2em"} />
                        Change Picture
                      </li>
                    </label>
                  </div>
                )}
              </div>
            )}
            <div className="col-md-5 profile-details">
              {userData && userData.user_profile && (
                <>
                  <h2>
                    {userData.user_profile.first_name +
                      " " +
                      userData.user_profile.last_name}
                    {user_id === currentUserId && (
                      <button className="btn" onClick={handleShowModal}>
                        <FaRegEdit size={"2em"} className="text-danger" />
                      </button>
                    )}
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
                    <FaRegCommentDots className="me-3 text-danger" />
                    Bio: {userData.user_profile.bio}
                  </p>
                  <p>
                    <FaVenusMars className="me-3 text-danger" />
                    Status: {userData.user_profile.status}
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
          <Suggested />
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-container">
            <div className="form-row">
              <div className="form-group mb-2">
                <div className="input-group">
                  <span className="input-group-text">First Name</span>
                  <input
                    type="text"
                    placeholder="First Name"
                    id="first_name"
                    name="first_name"
                    value={editedData?.first_name}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Last Name</span>
                  <input
                    type="text"
                    placeholder="Last Name"
                    id="last_name"
                    name="last_name"
                    value={editedData?.last_name}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Date of Birth</span>
                  <DatePicker
                    className="form-control"
                    showIcon
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Gender</span>
                  <select
                    onChange={handleChange}
                    className="form-control"
                    id="gender"
                    name="gender"
                    value={editedData.gender}
                  >
                    <option disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Place</span>
                  <input
                    type="text"
                    placeholder="Place"
                    id="place"
                    name="place"
                    value={editedData?.place}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">State</span>
                  <input
                    type="text"
                    placeholder="State"
                    id="state"
                    name="state"
                    value={editedData?.state}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Country</span>
                  <input
                    type="text"
                    placeholder="Country"
                    id="country"
                    name="country"
                    value={editedData?.country}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Skin Color</span>
                  <select
                    onChange={handleChange}
                    className="form-control"
                    id="skinColor"
                    name="skinColor"
                    value={editedData?.skinColor}
                  >
                    <option disabled>Select Skin Color</option>
                    <option value="Fair">Fair</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group mb-2">
                  <span className="input-group-text">Hair Color</span>
                  <select
                    onChange={handleChange}
                    className="form-control"
                    id="hairColor"
                    name="hairColor"
                    value={editedData?.hairColor}
                  >
                    <option disabled>Select Hair Color</option>
                    <option value="Black">Black</option>
                    <option value="Brown">Brown</option>
                    <option value="Blonde">Blonde</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="input-group mb-2">
                <span className="input-group-text">Bio</span>
                <textarea
                  placeholder="Bio"
                  id="bio"
                  name="bio"
                  value={editedData?.bio}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group mb-2">
                <span className="input-group-text">Status</span>
                <select
                  onChange={handleChange}
                  className="form-control"
                  id="status"
                  name="status"
                  value={editedData?.status}
                >
                  <option disabled>Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" onClick={validateForm}>
              Save Changes
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
export default Profile;
