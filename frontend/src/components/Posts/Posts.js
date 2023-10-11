import "./Posts.css";
import { FcCamera, FcCancel, FcOk } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
  AiFillLike,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";
import {
  BiEdit,
  BiTrash,
  BiMenu,
  BiSolidTime,
  BiSolidUserCircle,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { FallingLines } from "react-loader-spinner";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import AxiosInstance from "../../AxiosInstance";
import EditPost from "./EditPost";

const Posts = () => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState(null);
  const [postId, setPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState(null);
  const [editPost, setEditPost] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const Axios = AxiosInstance();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`${config.baseUrl}/posts/`);
      if (response.status === 200) {
        setData(response.data);
        console.log(data);
      } else {
        console.log("something went wrong!");
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    toast("rendering.");
  }, []);

  const postLikeHandler = async (id) => {
    try {
      const response = await axios.post(
        `${config.baseUrl}/posts/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 201 || response.status === 202) {
        toast.success(response.data.message);
        // Update local state to reflect the like status change
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  like_status: !item.like_status,
                  like_count: item.like_status
                    ? item.like_count - 1
                    : item.like_count + 1,
                }
              : item
          )
        );

        // add click effect to like button
        const likeButton = document.getElementById(`like-button-${id}`);
        likeButton.classList.add("like-button-click-effect");

        // Remove the className after a short duration (e.g., 300ms) to indicate the click effect
        setTimeout(() => {
          likeButton.classList.remove("like-button-click-effect");
        }, 300);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const onImageSelected = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const postSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      setLoading(true);
      const post = await axios.post(
        `${config.baseUrl}/posts/create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (post.status === 201) {
        // toast.success('Post created successfully.', { position: toast.POSITION.TOP_CENTER });
        setTitle("");
        setImage(null);
        setImagePreview(null);
        fetchData();
      } else {
        // toast.error('something went wrong!')
      }
    } catch (error) {
      // toast.error('error')
    } finally {
      setLoading(false);
    }
  };

  const imagePreviewCancel = () => {
    setImagePreview(null);
    setImage(null);
    setTitle("");
  };

  const deletePost = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.baseUrl}/posts/delete/${id}`);
      if (response.status === 200) {
        toast.success("Post deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Post not found !");
    } finally {
      setLoading(false);
    }
  };

  const iconStyle = {
    color: "#000",
    textDecoration: "none",
  };

  // fetch comments
  const handleComments = async (post_id) => {
    setPostId(post_id);
    setShowModal(!showModal);
    try {
      const response = await axios.get(
        `${config.baseUrl}/posts/comment/${post_id}`,

        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );

      if (response.status === 200) {
        setComments(response.data);
        console.log(comments);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  //add new comment
  const commentPostHandler = async () => {
    console.log(commentText);
    try {
      const response = await axios.post(
        `${config.baseUrl}/posts/comment/${postId}`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
      if (response.status === 201) {
        console.log(response.data);
        setCommentText(null);
        setShowModal(false);
        toast.success("Comment posted successfully");
        setData((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comment_count: post.comment_count + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // delete post comment handler
  const deleteCommentHandler = async (commentId) => {
    try {
      console.log(commentId);
      const response = await Axios.delete(`posts/comment/delete/${commentId}`);
      if (response.status === 200) {
        toast.success("Comment deleted");
        handleComments(postId);
      }
    } catch (error) {
      toast.success("No comment found");
    }
  };

  const editPostHandler = (postId, title, image) => {
    setPostId(postId);
    setEditPostTitle(title);
    setPostImage(image);
    setEditPost(true);
  };

  const closeEditPostModal = () => {
    setEditPost(false);
  };

  // Update the post list for edited post component

  const updatePostList = (updatedPost) => {
    setData((prevData) =>
      prevData.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className="col-md-12 col-lg-9 col-xs-9 offset-md-3">
      {/* edit post component loading here */}
      {editPost && (
        <EditPost
          postId={postId}
          title={editPostTitle}
          image={postImage}
          id={postId}
          closeModal={closeEditPostModal}
          fetchData={fetchData}
        />
      )}

      <div className="new-post mb-3">
        <p className="text-center">
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
          ) : null}
        </p>
        <form onSubmit={postSubmitHandler} encType="multipart/form-data">
          <div className="new-status-form ">
            <div className="mb-2 d-flex justify-content-between">
              <img
                src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                alt="avatar"
                width={"60px"}
              />

              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="What's on your mind?"
                className="new-post-form form-control"
                id=""
                required
              ></input>
            </div>
            <div className="mb-3">
              {imagePreview && (
                <div className="d-flex justify-content-center align-items-center">
                  <img className="w-25" src={imagePreview} alt="preview"></img>
                </div>
              )}
            </div>

            <div className="input-group mb-3 d-flex justify-content-center">
              <input
                className="form-control"
                type="file"
                accept="image/"
                id="file"
                name="image"
                onChange={onImageSelected}
                style={{ display: "none" }}
                loading="lazy"
                required
              />
              <label for="file">
                <li className="me-2 btn">
                  <FcCamera size={"2.4em"} />
                </li>
              </label>
              {imagePreview && (
                <button
                  onClick={imagePreviewCancel}
                  button
                  className="btn me-2"
                  type="button"
                  id="button-addon2"
                >
                  <FcCancel size={"2.4em"} />
                </button>
              )}
              <button className="btn" type="submit" id="button-addon2">
                <FcOk size={"2.4em"} style={{ color: "green" }} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* single post */}
      {data.map((item, index) => {
        return (
          <div className="row mx-auto text-center ">
            <div className="col post">
              <div className="mt-2">
                <div className="post-header d-flex justify-content-between">
                  <div className="post-owner d-flex justify-content-center text-center">
                    <img
                      src={config.media_url + item.profile_picture}
                      alt="avatar"
                      className="post-owner-img"
                    />
                    <span className="ms-2 d-flex flex-column">
                      <b>{item.post_owner}</b>

                      <p>
                        <BiSolidTime className="me-1" />
                        {moment(item.created).fromNow()}
                      </p>
                    </span>
                  </div>

                  <div className="post-options">
                    <div className="dropdown">
                      <button
                        className="btn"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BiMenu size={"1.6em"} />
                      </button>
                      <ul className="dropdown-menu">
                        <Link
                          onClick={() =>
                            editPostHandler(item.id, item.title, item.image)
                          }
                          className="dropdown-item text-decoration-none"
                        >
                          <BiEdit size={"1.3em"} className="me-2 " />
                          Edit
                        </Link>
                        <Link
                          onClick={() => deletePost(item.id)}
                          className="dropdown-item text-decoration-none"
                        >
                          <BiTrash size={"1.3em"} className="me-2" />
                          Delete
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="post-description">{item.title}</p>
                <img
                  className="post-image "
                  src={`${config.media_url}${item.image && item.image.image}`}
                  key={index}
                  alt="beach"
                />
              </div>
              <div className="m-1">
                <div className="d-flex justify-content-around" key={index}>
                  <li>{item.like_count ? item.like_count : 0} Likes</li>
                  <li>
                    {item.comment_count ? item.comment_count : 0} Comments
                  </li>
                  <li>{item.share ? item.comments : 0} Shares</li>
                </div>
              </div>

              <div className="d-flex justify-content-around">
                <li key={index} onClick={() => postLikeHandler(item.id)}>
                  <Link>
                    <AiFillLike
                      size={"2em"}
                      fill={item.like_status ? "#0d6efd" : "black"}
                      style={iconStyle}
                      id={`like-button-${item.id}`}
                    />
                  </Link>
                </li>
                <li onClick={() => handleComments(item.id)}>
                  <Link>
                    <AiOutlineComment size={"2em"} style={iconStyle} />
                  </Link>
                </li>
                <li>
                  <Link>
                    <AiOutlineShareAlt size={"2em"} style={iconStyle} />
                  </Link>
                </li>
              </div>
            </div>
          </div>
        );
      })}

      {/* Render the comment modal conditionally */}
      {showModal && (
        <Modal
          show={true}
          onHide={() => setShowModal(false)}
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="comments-container">
              {comments && comments.length > 0 ? (
                comments.map((item) => {
                  return (
                    <div className="row m-1 p-1">
                      <div className="comment-text">
                        <div className="d-flex justify-content-between mt-1">
                          <h5 className="mt-2">{item.text}</h5>
                          <BiTrash
                            size={"1.2em"}
                            onClick={() => deleteCommentHandler(item.id)}
                          />
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between">
                          <p>
                            <BiSolidUserCircle className="me-1" />
                            {item.user_name}
                          </p>
                          <p>
                            <BiSolidTime className="me-1" />
                            {moment(item.created_at).fromNow()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No Comments</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="input-group mb-3 input-group-lg">
              <input
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
                type="text"
                className="form-control input-group-lg"
                placeholder="Post your comment"
              />
              <button
                className="btn btn-success"
                type="button"
                id=""
                onClick={() => commentPostHandler()}
              >
                Post
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
export default Posts;
