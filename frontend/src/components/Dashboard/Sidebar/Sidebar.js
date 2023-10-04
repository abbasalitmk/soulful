import "./Sidebar.css";
import logo from "../../../assets/logo.png";
import { FaUserGroup, FaRegImages, FaRectangleList } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = {
    cursor: "pointer",
    textDecoration: "none",
    color: "white",
  };

  return (
    <>
      <div className="col-md-3 db-sidebar-container">
        <div className="db-sidebar-logo mx-auto mb-3">
          <img className="" src={logo} alt="" />
        </div>

        <ul className="db-sidebar-menu" style={linkStyle}>
          <Link style={linkStyle} to="/dashboard/users">
            <li>
              <FaUserGroup className="me-3" size={"1.1em"} />
              User Management
            </li>
          </Link>

          <Link style={linkStyle} to="/dashboard/posts">
            <li>
              <FaRegImages className="me-3" size={"1.1em"} />
              Post Management
            </li>
          </Link>
          <Link style={linkStyle} to="/dashboard/subscribers">
            <li>
              <FaRectangleList className="me-3" size={"1.1em"} />
              Subscribers
            </li>
          </Link>
          <Link to="/logout" style={linkStyle}>
            <li>
              <FiLogOut className="me-3" size={"1.1em"} />
              Logout
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
