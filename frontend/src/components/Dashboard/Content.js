import { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpeg";
import "./Dashboard.css";
import AxiosInstance from "../../AxiosInstance";

import { FaEyeSlash, FaRegHospital, FaTrashCan, FaEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import config from "../../config";
import moment from "moment";

const Content = () => {
  const Axios = AxiosInstance();
  const [postData, setPostData] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const url = "db/all-posts/";

  const fetchPosts = async (url) => {
    try {
      const response = await Axios.get(url);
      if (response.status === 200) {
        setPostData(response.data);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchPosts(url);
  }, []);

  const postStatus = async (userId) => {
    try {
      const response = await Axios.post(`db/status/${userId}`);
      if (response.status === 200) {
        toast.success(response.data.message);

        fetchPosts(url);
      }
    } catch (error) {
      if (error) {
        toast.error(error.response.data);
      }
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await Axios.delete(`db/delete/${postId}`);
      if (response.status === 200) {
        toast.success("Post deleted successfully");
        fetchPosts(url);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const loadNextPage = () => {
    fetchPosts(nextPageUrl);
  };

  const loadPrevPage = () => {
    fetchPosts(prevPageUrl);
  };

  return (
    <>
      <div className="col-md-9 offset-md-3">
        <h4 className="text-center mb-2">Post Management</h4>
        <div className="db-user-list text-center ">
          <table className="table table-striped">
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">User</th>
                <th scope="col">Created</th>
                <th scope="col">Likes</th>
                <th scope="col">Status</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className="">
              {postData && postData.results ? (
                postData.results.map((post, index) => {
                  return (
                    <tr key={index}>
                      {/* <th scope="row">{index}</th> */}
                      <td>
                        <img
                          src={config.media_url + post?.image?.image}
                          alt=""
                          width={"40px"}
                        />
                      </td>
                      <td>{post.title}</td>
                      <td>{post.post_owner}</td>
                      <td>{moment(post.created).format("MMM Do YY")}</td>
                      <td>{post.like_count}</td>
                      <td>
                        {post.is_active ? (
                          <button
                            onClick={() => postStatus(post.id)}
                            className="btn btn-outline-danger"
                          >
                            <FaEyeSlash size={"1.4em"} className="me-2" />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => postStatus(post.id)}
                            className="btn btn-outline-primary"
                          >
                            <FaEye size={"1.4em"} className="me-2" />
                            UnBlock
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="btn btn-outline-danger"
                        >
                          <FaTrashCan size={"1.4em"} className="me-2" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <h2>No Posts Found</h2>
              )}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item p-0 m-1 ${
                  prevPageUrl === null ? "disabled" : "active"
                }`}
              >
                <button onClick={loadPrevPage} className="page-link">
                  Previous
                </button>
              </li>

              <li
                className={`page-item p-0 m-1 ${
                  nextPageUrl === null ? "disabled" : "active"
                }`}
              >
                <button onClick={loadNextPage} className="page-link">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
export default Content;
