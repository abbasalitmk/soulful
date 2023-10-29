import { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpeg";
import "./Dashboard.css";
import AxiosInstance from "../../AxiosInstance";

import { FaEyeSlash, FaRegHospital, FaTrashCan, FaEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import config from "../../config";
import moment from "moment";

const Membership = () => {
  const Axios = AxiosInstance();
  const [subscribers, setSubscribers] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const url = "db/subscribers/";

  const fetchSubscribers = async (url) => {
    try {
      const response = await Axios.get(url);
      if (response.status === 200) {
        setSubscribers(response.data);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchSubscribers(url);
  }, []);

  const loadNextPage = () => {
    fetchSubscribers(nextPageUrl);
  };

  const loadPrevPage = () => {
    fetchSubscribers(prevPageUrl);
  };

  return (
    <>
      <div className="col-md-9 offset-md-3">
        <h4 className="text-center mb-2">Subscribers Management</h4>
        <div className="db-user-list text-center ">
          <table className="table table-striped">
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">expiration_date</th>
                <th scope="col">status</th>
              </tr>
            </thead>
            <tbody className="">
              {subscribers && subscribers.results ? (
                subscribers.results.map((post, index) => {
                  return (
                    <tr key={index}>
                      {/* <th scope="row">{index}</th> */}

                      <td>{post.user.name}</td>
                      <td>{post.user.email}</td>
                      <td>{post.expiration_date}</td>
                      {post.is_active ? <td>Active</td> : <td>Expired</td>}
                    </tr>
                  );
                })
              ) : (
                <h2>No Subscribers Found</h2>
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
export default Membership;
