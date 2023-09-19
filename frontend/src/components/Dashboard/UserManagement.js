import { useEffect, useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import avatar from "../../assets/avatar.jpeg";
import "./Dashboard.css";
import { FaEyeSlash, FaRegHospital, FaEye } from "react-icons/fa6";
import toast from "react-hot-toast";

const UserManagement = () => {
  const Axios = AxiosInstance();
  const [usersData, setUsersData] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchUser = async (url) => {
    try {
      const response = await Axios.get(url);
      if (response.status === 200) {
        setUsersData(response.data);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
        console.log(response.data.next);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    const url = "db/all-users/";

    fetchUser(url);
  }, []);

  const blockUser = async (userId) => {
    try {
      const response = await Axios.post("/db/block-user/", {
        user_id: userId,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        const url = "db/all-users/";
        fetchUser(url);
      }
    } catch (error) {
      if (error) {
        toast.error(error.response.data);
      }
    }
  };

  const loadNextPage = () => {
    fetchUser(nextPageUrl);
  };

  const loadPrevPage = () => {
    fetchUser(prevPageUrl);
  };

  return (
    <>
      <div className="col-md-9 mt-3 offset-md-3">
        <h5>User Management</h5>
        <div className="db-user-list text-center ">
          <table className="table table-striped">
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {usersData && usersData.results ? (
                usersData.results.map((user, index) => {
                  return (
                    <tr key={index}>
                      {/* <th scope="row">{index}</th> */}
                      <td>
                        <img src={avatar} alt="" width={"40px"} />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.is_admin ? "Admin" : "User"}</td>
                      <td>{user.is_active ? "Active" : <b>Inactive</b>}</td>
                      <td>
                        {user.is_active ? (
                          <button
                            onClick={() => blockUser(user.id)}
                            className="btn btn-outline-danger"
                          >
                            <FaEyeSlash size={"1.4em"} className="me-2" />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => blockUser(user.id)}
                            className="btn btn-outline-primary"
                          >
                            <FaEye size={"1.4em"} className="me-2" />
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <h2>No Users Found</h2>
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
export default UserManagement;
